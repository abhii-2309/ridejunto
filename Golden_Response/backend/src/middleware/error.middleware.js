export function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  error.code = "NOT_FOUND";
  next(error);
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;

  res.status(status).json({
    success: false,
    message: error.message || "Something went wrong",
    code: error.code || "SERVER_ERROR"
  });
}
