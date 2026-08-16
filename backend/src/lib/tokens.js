import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    streak: user.streak,
    lastCheckInDate: user.lastCheckInDate,
  };
}
