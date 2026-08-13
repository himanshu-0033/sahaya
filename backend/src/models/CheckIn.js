import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true }, // inkblot id/label
    word: { type: String, required: true },
    mood: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
);

const checkInSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true }, // "YYYY-MM-DD", one check-in per user per day
    responses: { type: [responseSchema], required: true },
    averageMood: { type: Number, required: true },
    quote: { type: String, required: true },
    rewardCode: { type: String, required: true }, // encoded into the QR
    aiSentimentFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

checkInSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("CheckIn", checkInSchema);
