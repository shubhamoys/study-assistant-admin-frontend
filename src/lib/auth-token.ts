// Bearer auth: both tokens live client-side and the access token is attached
// to every GraphQL request (see src/graphql/apollo-client.ts); the refresh
// token is only ever read by src/lib/token-refresh.ts. Isolated here so the
// Apollo link, the token-refresh util, and the Redux persistence middleware
// all share the same storage keys instead of duplicating them.
//
// Namespaced distinctly from the main app's `study-assistant.*` keys even
// though the two apps run on separate origins (and so already have isolated
// localStorage) — cheap insurance against ever running them same-origin, and
// keeps a browser's storage inspector unambiguous about which app a token
// belongs to.
const ACCESS_TOKEN_KEY = "study-assistant-admin.accessToken";
const REFRESH_TOKEN_KEY = "study-assistant-admin.refreshToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** Pass null to clear both tokens (logout, or a refresh attempt that failed). */
export function setTokens(
  tokens: { accessToken: string; refreshToken: string } | null,
): void {
  if (typeof window === "undefined") return;
  if (tokens) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
