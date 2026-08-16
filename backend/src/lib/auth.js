import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function getUserIdFromRequest(req) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch {
    return null;
  }
}

export async function getCaregiverFromRequest(req) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return null;
  const user = await User.findById(userId);
  if (!user || user.role !== "caregiver") return null;
  return user;
}
