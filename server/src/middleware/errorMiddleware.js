export function errorMiddleware(err, req, res, next) {
  console.error(err.stack || err);

  res.status(500).json({
    message: "Internal server error",
  });
}
