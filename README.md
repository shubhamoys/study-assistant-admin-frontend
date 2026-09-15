# StudyLoop — Admin Panel

The admin panel for **StudyLoop**, a spaced-repetition flashcard platform. This is a separate [Next.js](https://nextjs.org/) app (its own project, own login, own deployment) for platform administrators — managing users, decks, categories, coupons, and viewing analytics. It's not needed by regular users of the main app.

It talks to the same GraphQL API as the main app:

- **`study-assistant-backend`** — the API this app talks to. **You need this running first.**
- **`study-assistant-frontend`** — the main, consumer-facing app (not needed to use this admin panel).

If you haven't set up the backend yet, do that first — see its own README, in particular the database seeding step, which creates the admin account you'll log in with here.

---

## Tech stack

Same core stack as the main app (they're sibling projects sharing the same design system and conventions):

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), React 19 |
| Language | TypeScript |
| Data fetching | [Apollo Client](https://www.apollographql.com/docs/react) (GraphQL) |
| State | Redux Toolkit (auth session state, persisted to `localStorage`, kept isolated from the main app's own session) |
| Styling | SCSS Modules + [Tailwind CSS v4](https://tailwindcss.com/) tokens + [shadcn/ui](https://ui.shadcn.com/) primitives |
| Forms | React Hook Form + [Zod](https://zod.dev/) validation |
| Access control | Role-gated (`ADMIN` / `SUPER_ADMIN` only) — there is no public registration in this app |

## Prerequisites

- **[Node.js](https://nodejs.org/) 20 or later** and npm
- **The backend (`study-assistant-backend`) running, migrated, and seeded** — see that project's README. Seeding is what creates the admin account this app requires to log in; there is no sign-up form here.

## Setup — from cloning to running

**1. Clone the repo and install dependencies**

```bash
git clone <this-repository-url>
cd study-assistant-admin-frontend
npm install
```

**2. Create your environment file**

```bash
cp .env.example .env.local
```

The defaults (`NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql`, `NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000`) already match the other two projects' default setup.

**3. Start the dev server**

```bash
npm run dev
```

This runs on **port 3001** (not Next's default 3000 — the `dev`/`start` scripts already pass `-p 3001`, since the main app takes 3000 and the backend's CORS config specifically expects the admin panel at 3001). Open **http://localhost:3001**.

**4. Log in**

Use the admin account created when you seeded the backend's database: the email is whatever `SEED_ADMIN_EMAIL` was set to there (default `admin@studyloop.dev`), and the password is whatever you set `SEED_ADMIN_PASSWORD` to. This account has the **Super Admin** role, which can do everything a regular Admin can plus add/promote/demote other admins.

There's no self-registration here by design — new admin accounts are created from inside the app itself (Users → Add Admin), by an existing Super Admin.

## Important commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (hot reload) at `http://localhost:3001` |
| `npm run build` | Production build (also type-checks the whole project) |
| `npm run start` | Run the production build (`npm run build` first), also on port 3001 |
| `npm run lint` | ESLint |

There's no separate test suite in this project — testing was done manually in the browser throughout development (see the backend's README for its automated e2e suite, which covers the shared GraphQL API this app calls, including every admin-only operation).

## What you can do here

- **Dashboard** — platform-wide stats at a glance.
- **Users** — search/paginate, promote/demote between User and Admin, add new admin accounts (Super Admin only).
- **Categories** — create/edit/delete.
- **Decks** — manage any public deck on the platform (not just ones you created), including flashcards, pricing (free/paid), and viewing per-deck stats.
- **Coupons** — create percentage or fixed-amount discount codes, with optional expiry/redemption limits/minimum order amount.
- **Analytics** — usage and marketplace figures.
- **Account settings** — your own profile, avatar, and password.

## Troubleshooting

- **Can't get past login / "invalid credentials"** — double-check you're using the credentials from the backend's `.env` (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`), and that you actually ran `npm run db:seed` on the backend at least once.
- **Logged in as a regular user account and got bounced out** — this app is role-gated; only `ADMIN`/`SUPER_ADMIN` accounts can get past the login screen. Regular user accounts (including the seeded reviewer demo accounts) will be rejected here — that's expected, use them in the main app instead.
- **GraphQL calls fail / CORS errors** — confirm the backend is running and its `CORS_ORIGIN` includes `http://localhost:3001` (it does by default).

## Running the full project

See `study-assistant-backend`'s README for the full three-project setup (clone order, expected folder layout, port assignments). In short: this app expects to live as a sibling folder to `study-assistant-backend` and `study-assistant-frontend`, running on port 3001 while they run on 4000 and 3000 respectively.
