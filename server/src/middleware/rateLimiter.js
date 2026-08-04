export function createRateLimiter(ratelimit) {
  return async (req, res, next) => {
    const identifier = req.user?.id ?? req.headers["x-forwarded-for"] ?? req.ip;

    const { success, reset } = await ratelimit.limit(identifier);

    if (!success) {
      res.setHeader(
        "Retry-After",
        Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
      );

      return res.status(429).json({
        message: "Too many requests",
      });
    }

    next();
  };
}
