import jwt from "jsonwebtoken";

export function signToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
}
