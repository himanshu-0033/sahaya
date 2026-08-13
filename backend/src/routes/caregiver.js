import { Router } from "express";
import User from "../models/User.js";
import CheckIn from "../models/CheckIn.js";
import { requireAuth, requireCaregiver } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireCaregiver);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function statusFor(user, todayCheckIn) {
  if (!todayCheckIn) return "missed";
  if (todayCheckIn.aiSentimentFlag) return "concerning";
  return "stable";
}

// Grid of assigned patients with a color-coded status for today.
router.get("/patients", async (req, res) => {
  const patients = await User.find({ caregiver: req.caregiver._id, role: "patient" }).lean();
  const date = todayStr();

  const todaysCheckIns = await CheckIn.find({
    user: { $in: patients.map((p) => p._id) },
    date,
  }).lean();
  const checkInByUser = new Map(todaysCheckIns.map((c) => [c.user.toString(), c]));

  res.json({
    patients: patients.map((p) => ({
      id: p._id,
      name: p.name,
      email: p.email,
      streak: p.streak,
      lastCheckInDate: p.lastCheckInDate,
      status: statusFor(p, checkInByUser.get(p._id.toString())),
    })),
  });
});

// 30-day mood graph, word cloud, and flagged history for one patient.
router.get("/patients/:id", async (req, res) => {
  const patient = await User.findOne({ _id: req.params.id, caregiver: req.caregiver._id, role: "patient" }).lean();
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  const checkIns = await CheckIn.find({ user: patient._id }).sort({ date: 1 }).limit(30).lean();

  const wordCounts = new Map();
  for (const c of checkIns) {
    for (const r of c.responses) {
      const word = r.word.trim().toLowerCase();
      if (!word) continue;
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  res.json({
    patient: { id: patient._id, name: patient.name, email: patient.email, streak: patient.streak },
    moodHistory: checkIns.map((c) => ({ date: c.date, averageMood: c.averageMood, flagged: c.aiSentimentFlag })),
    wordCloud: [...wordCounts.entries()]
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count),
    flaggedCheckIns: checkIns
      .filter((c) => c.aiSentimentFlag)
      .map((c) => ({ date: c.date, responses: c.responses, averageMood: c.averageMood })),
  });
});

export default router;
