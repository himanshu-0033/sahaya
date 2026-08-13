import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "caregiver"], default: "patient" },
    caregiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    streak: { type: Number, default: 0 },
    lastCheckInDate: { type: String, default: null }, // "YYYY-MM-DD"
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
