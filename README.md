# Sahaya

A daily check-in prototype: patients respond to three quick inkblot prompts,
get a mood-based quote and reward QR code, and build a streak. Caregivers see
a color-coded dashboard of their patients with AI-style sentiment flagging.

## Structure

- `backend/` — Express + MongoDB API (auth, check-ins, caregiver views)
- `frontend/` — patient-facing app (Vite + React), mobile-first
- `dashboard/` — caregiver dashboard (Vite + React + Tailwind)

## Local development

Each app has its own `.env.example` — copy to `.env` and adjust as needed.

```bash
cd backend && npm install && npm run dev     # http://localhost:4000
cd frontend && npm install && npm run dev    # http://localhost:5173
cd dashboard && npm install && npm run dev   # http://localhost:5174
```

The backend falls back to an in-memory MongoDB automatically if
`MONGODB_URI` isn't reachable, so no local Mongo install is required for a
quick demo (data resets on restart).

## Deploying (all on Vercel)

All three apps deploy to Vercel as **separate projects** from this same repo.
When importing the repo, create three projects and set each one's **Root
Directory** accordingly:

- **`frontend/`** and **`dashboard/`** — static Vite apps (zero-config
  Vercel builds). Set the `VITE_API_URL` environment variable on each to your
  deployed backend project's URL plus `/api`, e.g.
  `https://sahaya-api.vercel.app/api`.
- **`backend/`** — deploys as Vercel Serverless Functions, one per route
  under `backend/api/`. Express (`src/server.js`) is kept only for local dev
  via `npm run dev`; the actual route logic lives in `src/controllers/` and
  is shared by both `src/routes/` (Express) and `api/` (Vercel) so the two
  never drift. Set on the backend project:
  - `MONGODB_URI` — a real MongoDB Atlas connection string. The in-memory
    fallback used for local dev is disabled automatically on Vercel
    (`process.env.VERCEL` is set), since downloading a Mongo binary at
    request time isn't viable in a serverless function.
  - `JWT_SECRET` — a strong random secret.
  - `CLIENT_ORIGIN` — a comma-separated list of the deployed `frontend` and
    `dashboard` origins, e.g.
    `https://sahaya.vercel.app,https://sahaya-dashboard.vercel.app`.

  You can exercise the serverless functions locally with `vercel dev`
  (reads `backend/.env` the same way `npm run dev` does).
