# Sahaya

A daily check-in prototype: patients respond to three quick inkblot prompts,
get a mood-based quote and reward QR code, and build a streak. Caregivers see
a color-coded dashboard of their patients with AI-style sentiment flagging.

## Structure

- `backend/` — Express + PostgreSQL (via Prisma) API (auth, check-ins, caregiver views)
- `frontend/` — patient-facing app (Vite + React), mobile-first
- `dashboard/` — caregiver dashboard (Vite + React + Tailwind)

## Local development

Each app has its own `.env.example` — copy to `.env` and adjust as needed.
The backend needs a real PostgreSQL database reachable at `DATABASE_URL`
(e.g. a local Postgres install, Docker, or a free Render/Neon instance) —
unlike the old MongoDB setup, there's no in-memory fallback.

```bash
cd backend
npm install                # also runs `prisma generate`
npx prisma db push         # creates tables from prisma/schema.prisma
npm run dev                 # http://localhost:4000

cd frontend && npm install && npm run dev    # http://localhost:5173
cd dashboard && npm install && npm run dev   # http://localhost:5174
```

## Deploying

- **`backend/` + database** deploy to Render:
  1. Create a **PostgreSQL** instance on Render and copy its **Internal
     Database URL**.
  2. Create a **Web Service** on Render pointing at this repo with **Root
     Directory** `backend`.
  3. Build command: `npm install && npx prisma db push`
     Start command: `npm start`
  4. Set env vars: `DATABASE_URL` (the Postgres URL from step 1),
     `JWT_SECRET` (a long random string), `CLIENT_ORIGIN` (your deployed
     patient app's origin), `PORT` is provided by Render automatically.
- **`frontend/` and `dashboard/`** deploy to Vercel as static Vite apps. When
  importing this repo into Vercel, create two separate projects and set each
  one's **Root Directory** to `frontend` or `dashboard`. Set the
  `VITE_API_URL` environment variable on each project to your deployed
  backend's URL (e.g. `https://your-api.onrender.com/api`).
