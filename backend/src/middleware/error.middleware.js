// custom error carrying an http status and a short code
class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// last middleware in the chain, catches errors passed to next()
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  // hide unexpected error details from the client, log them instead
  if (!err.statusCode) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.statusCode ? err.message : "Something went wrong",
    },
  });
}

module.exports = { AppError, errorHandler };
