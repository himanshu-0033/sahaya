import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getToday, submitCheckIn, getHistory } from "../controllers/checkins.js";

const router = Router();
router.use(requireAuth);

router.get("/today", async (req, res) => {
  res.json(await getToday(req.userId));
});

router.post("/", async (req, res) => {
  res.status(201).json(await submitCheckIn(req.userId, req.body?.responses));
});

router.get("/history", async (req, res) => {
  res.json(await getHistory(req.userId));
});

export default router;
