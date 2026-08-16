import { getUserIdFromRequest, getCaregiverFromRequest } from "../lib/auth.js";

export function requireAuth(req, res, next) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Missing or invalid auth token" });
  req.userId = userId;
  next();
}

export async function requireCaregiver(req, res, next) {
  const caregiver = await getCaregiverFromRequest(req);
  if (!caregiver) return res.status(403).json({ error: "Caregiver access required" });
  req.caregiver = caregiver;
  next();
}
