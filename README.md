# AI Study Assistant — Admin

Platform administration app for AI Study Assistant. A separate Next.js app from `study-assistant-frontend`, sharing the same backend (`study-assistant-backend`) and the same design system.

## Getting started

```bash
npm install
npm run dev
```

Runs on `http://localhost:3001` by default (the main app takes 3000). Requires the backend running at the URL set by `NEXT_PUBLIC_GRAPHQL_URL` in `.env.local` (see `.env.example`).

Sign in with an existing account that has the `ADMIN` role — the login page rejects anyone else.

See the root `AGENT_CONTEXT.md` and `progress.md` for what's built so far.
