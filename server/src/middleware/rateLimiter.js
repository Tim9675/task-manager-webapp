import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-limit-key"); // change later when user auth is implemented

    if (!success) return res.status(429).json({ message: "Too many requests" });

    next();
  } catch (error) {
    console.error("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
