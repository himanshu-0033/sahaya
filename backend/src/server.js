import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { HttpError } from "./lib/HttpError.js";
import authRoutes from "./routes/auth.js";
import checkinRoutes from "./routes/checkins.js";
import caregiverRoutes from "./routes/caregiver.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/caregiver", caregiverRoutes);

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...err.extra });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Sahaya API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
