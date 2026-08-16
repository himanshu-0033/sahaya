import User from "../models/User.js";
import CheckIn from "../models/CheckIn.js";
import { HttpError } from "../lib/HttpError.js";
import { todayStr } from "../lib/date.js";
import { statusFor } from "../lib/status.js";

// Grid of assigned patients with a color-coded status for today.
export async function listPatients(caregiverId) {
  const patients = await User.find({ caregiver: caregiverId, role: "patient" }).lean();
  const date = todayStr();

  const todaysCheckIns = await CheckIn.find({
    user: { $in: patients.map((p) => p._id) },
    date,
  }).lean();
  const checkInByUser = new Map(todaysCheckIns.map((c) => [c.user.toString(), c]));

  return {
    patients: patients.map((p) => ({
      id: p._id,
      name: p.name,
      email: p.email,
      streak: p.streak,
      lastCheckInDate: p.lastCheckInDate,
      status: statusFor(p, checkInByUser.get(p._id.toString())),
    })),
  };
}

// 30-day mood graph, word cloud, and flagged history for one patient.
export async function getPatientDetail(caregiverId, patientId) {
  const patient = await User.findOne({ _id: patientId, caregiver: caregiverId, role: "patient" }).lean();
  if (!patient) throw new HttpError(404, "Patient not found");

  const checkIns = await CheckIn.find({ user: patient._id }).sort({ date: 1 }).limit(30).lean();

  const wordCounts = new Map();
  for (const c of checkIns) {
    for (const r of c.responses) {
      const word = r.word.trim().toLowerCase();
      if (!word) continue;
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  return {
    patient: { id: patient._id, name: patient.name, email: patient.email, streak: patient.streak },
    moodHistory: checkIns.map((c) => ({ date: c.date, averageMood: c.averageMood, flagged: c.aiSentimentFlag })),
    wordCloud: [...wordCounts.entries()]
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count),
    flaggedCheckIns: checkIns
      .filter((c) => c.aiSentimentFlag)
      .map((c) => ({ date: c.date, responses: c.responses, averageMood: c.averageMood })),
  };
}
