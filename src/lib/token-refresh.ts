import { GRAPHQL_URL } from "./graphql-endpoint";
import { getRefreshToken, setTokens } from "./auth-token";

const REFRESH_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

// Deliberately a plain fetch(), not a call through the app's ApolloClient
// instance: this runs from inside apollo-client.ts's own error link (see
// there), so routing it back through Apollo would re-enter the same link
// chain it's called from.
async function requestNewTokens(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { refreshToken },
      }),
    });
    const json: {
      data?: { refreshToken?: { accessToken: string; refreshToken: string } };
    } = await res.json();

    const payload = json.data?.refreshToken;
    if (!payload) {
      setTokens(null);
      return null;
    }

    setTokens(payload);
    return payload.accessToken;
  } catch {
    // Network failure talking to the refresh endpoint — leave the stored
    // (still-expired) tokens alone rather than logging the user out; the
    // next request will just retry the refresh instead of assuming the
    // refresh token itself was rejected.
    return null;
  }
}

// The refresh token is single-use (server rotates it on every call) — if two
// requests 401 at once, refreshing separately for each would invalidate the
// first one's new token out from under the second. Every concurrent caller
// shares this one in-flight refresh instead.
let inFlight: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  if (!inFlight) {
    inFlight = requestNewTokens(refreshToken).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
