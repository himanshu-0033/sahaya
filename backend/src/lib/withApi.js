import { connectDB } from "../db.js";
import { applyCors } from "./cors.js";
import { HttpError } from "./HttpError.js";
import { getUserIdFromRequest } from "./auth.js";
import User from "../models/User.js";

// Wraps a Vercel serverless function handler with CORS, method checks, DB
// connection, optional auth/caregiver gating, and HttpError -> JSON mapping.
export function withApi(methods, fn, { auth = false, caregiver = false } = {}) {
  const allowed = Array.isArray(methods) ? methods : [methods];

  return async function handler(req, res) {
    if (applyCors(req, res)) return;

    if (!allowed.includes(req.method)) {
      res.setHeader("Allow", allowed.join(", "));
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      await connectDB();

      if (auth || caregiver) {
        const userId = getUserIdFromRequest(req);
        if (!userId) throw new HttpError(401, "Missing or invalid auth token");
        req.userId = userId;
      }

      if (caregiver) {
        const user = await User.findById(req.userId);
        if (!user || user.role !== "caregiver") throw new HttpError(403, "Caregiver access required");
        req.caregiver = user;
      }

      await fn(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message, ...err.extra });
      }
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
