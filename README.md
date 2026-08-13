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

## Deploying

- **`frontend/` and `dashboard/`** deploy to Vercel as static Vite apps. When
  importing this repo into Vercel, create two separate projects and set each
  one's **Root Directory** to `frontend` or `dashboard`. Set the
  `VITE_API_URL` environment variable on each project to your deployed
  backend's URL (e.g. `https://your-api.onrender.com/api`).
- **`backend/`** is a stateful Express server and doesn't fit Vercel's
  serverless model well — deploy it to something like Render, Railway, or
  Fly.io instead, with a real `MONGODB_URI` (e.g. MongoDB Atlas) and a
  `CLIENT_ORIGIN` matching your deployed frontend's origin.
