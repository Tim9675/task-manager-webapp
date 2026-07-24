import jwt from "jsonwebtoken";

export function authMiddleWare(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [, token] = authHeader.split(" ");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      userId: decoded.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
