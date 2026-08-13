import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireCaregiver } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireCaregiver);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function statusFor(todayCheckIn) {
  if (!todayCheckIn) return "missed";
  if (todayCheckIn.aiSentimentFlag) return "concerning";
  return "stable";
}

// Grid of assigned patients with a color-coded status for today.
router.get("/patients", async (req, res) => {
  const patients = await prisma.user.findMany({ where: { caregiverId: req.caregiver.id, role: "patient" } });
  const date = todayStr();

  const todaysCheckIns = await prisma.checkIn.findMany({
    where: { userId: { in: patients.map((p) => p.id) }, date },
  });
  const checkInByUser = new Map(todaysCheckIns.map((c) => [c.userId, c]));

  res.json({
    patients: patients.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      streak: p.streak,
      lastCheckInDate: p.lastCheckInDate,
      status: statusFor(checkInByUser.get(p.id)),
    })),
  });
});

// 30-day mood graph, word cloud, and flagged history for one patient.
router.get("/patients/:id", async (req, res) => {
  const patient = await prisma.user.findFirst({
    where: { id: req.params.id, caregiverId: req.caregiver.id, role: "patient" },
  });
  if (!patient) return res.status(404).json({ error: "Patient not found" });

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: patient.id },
    orderBy: { date: "asc" },
    take: 30,
    include: { responses: true },
  });

  const wordCounts = new Map();
  for (const c of checkIns) {
    for (const r of c.responses) {
      const word = r.word.trim().toLowerCase();
      if (!word) continue;
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  res.json({
    patient: { id: patient.id, name: patient.name, email: patient.email, streak: patient.streak },
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
