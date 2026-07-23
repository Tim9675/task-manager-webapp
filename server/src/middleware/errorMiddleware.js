export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack || err);

  const status = err.status || 500;

  res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message,
  });
}
