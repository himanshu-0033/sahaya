import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { HttpError } from "../lib/HttpError.js";
import { signToken, publicUser } from "../lib/tokens.js";

export async function signup({ name, email, password, role } = {}) {
  if (!name || !email || !password) {
    throw new HttpError(400, "name, email and password are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new HttpError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const userRole = role === "caregiver" ? "caregiver" : "patient";

  // Prototype assignment: every new patient is attached to the first caregiver on record.
  const caregiver = userRole === "patient" ? await User.findOne({ role: "caregiver" }) : null;

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: userRole,
    caregiver: caregiver?._id || null,
  });

  return { token: signToken(user), user: publicUser(user) };
}

export async function login({ email, password } = {}) {
  if (!email || !password) throw new HttpError(400, "email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new HttpError(401, "Invalid email or password");

  return { token: signToken(user), user: publicUser(user) };
}
