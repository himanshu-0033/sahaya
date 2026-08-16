import crypto from "crypto";
import QRCode from "qrcode";
import CheckIn from "../models/CheckIn.js";
import User from "../models/User.js";
import { HttpError } from "../lib/HttpError.js";
import { pickQuote } from "../data/quotes.js";
import { flagCheckIn } from "../data/sentiment.js";
import { todayStr, isYesterday } from "../lib/date.js";

export async function getToday(userId) {
  const date = todayStr();
  const checkIn = await CheckIn.findOne({ user: userId, date });
  return { date, checkedIn: Boolean(checkIn), checkIn: checkIn || null };
}

export async function submitCheckIn(userId, responses) {
  if (!Array.isArray(responses) || responses.length !== 3) {
    throw new HttpError(400, "responses must be an array of exactly 3 entries");
  }
  for (const r of responses) {
    if (!r.prompt || !r.word || typeof r.mood !== "number" || r.mood < 1 || r.mood > 5) {
      throw new HttpError(400, "each response needs prompt, word, and mood (1-5)");
    }
  }

  const date = todayStr();
  const existing = await CheckIn.findOne({ user: userId, date });
  if (existing) throw new HttpError(409, "Already checked in today", { checkIn: existing });

  const averageMood = responses.reduce((sum, r) => sum + r.mood, 0) / responses.length;
  const quote = pickQuote(averageMood);
  const aiSentimentFlag = flagCheckIn(responses, averageMood);
  const rewardCode = `SAHAYA-${userId.slice(-6).toUpperCase()}-${date.replace(/-/g, "")}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;

  const checkIn = await CheckIn.create({
    user: userId,
    date,
    responses,
    averageMood,
    quote,
    rewardCode,
    aiSentimentFlag,
  });

  const user = await User.findById(userId);
  const wasYesterday = user.lastCheckInDate && isYesterday(user.lastCheckInDate, date);
  user.streak = wasYesterday ? user.streak + 1 : 1;
  user.lastCheckInDate = date;
  await user.save();

  const qrDataUrl = await QRCode.toDataURL(rewardCode, { margin: 1, width: 300 });

  return { checkIn, streak: user.streak, qrDataUrl };
}

export async function getHistory(userId) {
  const checkIns = await CheckIn.find({ user: userId }).sort({ date: 1 }).lean();
  return {
    entries: checkIns.map((c) => ({ date: c.date, averageMood: c.averageMood, quote: c.quote })),
  };
}
