// Shared by apollo-client.ts (normal request traffic) and token-refresh.ts
// (a plain fetch(), deliberately outside Apollo — see that file for why).
// Same backend the main app talks to — the admin panel is a separate
// frontend, not a separate API (see DEVELOPMENT_ROADMAP.md's Phase 3 note).
export const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

// The backend's own origin, derived from GRAPHQL_URL — used for resolving a
// relative uploaded-asset path (deck covers, markdown-embedded images) into
// a real <img src>, since the backend is a different origin than this app.
export const API_ORIGIN = GRAPHQL_URL.replace(/\/graphql\/?$/, "");

// study-assistant-frontend's own origin — used only for "View in store"
// links, since a deck admins manage here is actually browsed/studied there.
export const MAIN_APP_ORIGIN =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3000";
