import { Router } from "express";
import { signup, login } from "../controllers/auth.js";

const router = Router();

router.post("/signup", async (req, res) => {
  res.status(201).json(await signup(req.body));
});

router.post("/login", async (req, res) => {
  res.json(await login(req.body));
});

export default router;
