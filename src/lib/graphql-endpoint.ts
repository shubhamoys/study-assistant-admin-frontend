// Shared by apollo-client.ts (normal request traffic) and token-refresh.ts
// (a plain fetch(), deliberately outside Apollo — see that file for why).
// Same backend the main app talks to — the admin panel is a separate
// frontend, not a separate API (see DEVELOPMENT_ROADMAP.md's Phase 3 note).
export const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";
