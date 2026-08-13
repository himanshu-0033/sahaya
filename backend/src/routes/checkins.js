import { Router } from "express";
import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { pickQuote } from "../data/quotes.js";
import { flagCheckIn } from "../data/sentiment.js";

const router = Router();
router.use(requireAuth);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr, today) {
  const d = new Date(dateStr);
  const t = new Date(today);
  const diffDays = Math.round((t - d) / 86400000);
  return diffDays === 1;
}

// Has the current user already checked in today?
router.get("/today", async (req, res) => {
  const date = todayStr();
  const checkIn = await prisma.checkIn.findUnique({
    where: { userId_date: { userId: req.userId, date } },
    include: { responses: true },
  });
  res.json({ date, checkedIn: Boolean(checkIn), checkIn: checkIn || null });
});

// Submit today's 3-response check-in
router.post("/", async (req, res) => {
  const { responses } = req.body;

  if (!Array.isArray(responses) || responses.length !== 3) {
    return res.status(400).json({ error: "responses must be an array of exactly 3 entries" });
  }
  for (const r of responses) {
    if (!r.prompt || !r.word || typeof r.mood !== "number" || r.mood < 1 || r.mood > 5) {
      return res.status(400).json({ error: "each response needs prompt, word, and mood (1-5)" });
    }
  }

  const date = todayStr();
  const existing = await prisma.checkIn.findUnique({ where: { userId_date: { userId: req.userId, date } } });
  if (existing) return res.status(409).json({ error: "Already checked in today", checkIn: existing });

  const averageMood = responses.reduce((sum, r) => sum + r.mood, 0) / responses.length;
  const quote = pickQuote(averageMood);
  const aiSentimentFlag = flagCheckIn(responses, averageMood);
  const rewardCode = `SAHAYA-${req.userId.slice(-6).toUpperCase()}-${date.replace(/-/g, "")}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;

  const checkIn = await prisma.checkIn.create({
    data: {
      userId: req.userId,
      date,
      averageMood,
      quote,
      rewardCode,
      aiSentimentFlag,
      responses: {
        create: responses.map((r) => ({ prompt: r.prompt, word: r.word, mood: r.mood })),
      },
    },
    include: { responses: true },
  });

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  const wasYesterday = user.lastCheckInDate && isYesterday(user.lastCheckInDate, date);
  const streak = wasYesterday ? user.streak + 1 : 1;
  await prisma.user.update({ where: { id: req.userId }, data: { streak, lastCheckInDate: date } });

  const qrDataUrl = await QRCode.toDataURL(rewardCode, { margin: 1, width: 300 });

  res.status(201).json({
    checkIn,
    streak,
    qrDataUrl,
  });
});

// Journal / progress history
router.get("/history", async (req, res) => {
  const checkIns = await prisma.checkIn.findMany({
    where: { userId: req.userId },
    orderBy: { date: "asc" },
  });
  res.json({
    entries: checkIns.map((c) => ({
      date: c.date,
      averageMood: c.averageMood,
      quote: c.quote,
    })),
  });
});

export default router;
