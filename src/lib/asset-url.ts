import { API_ORIGIN } from "@/lib/graphql-endpoint";

/** Any relative upload path the API returns (deck covers, markdown image attachments) needs the backend's own origin prefixed. */
export function resolveAssetUrl(path: string | null): string | null {
  if (!path) return null;
  return `${API_ORIGIN}${path}`;
}
