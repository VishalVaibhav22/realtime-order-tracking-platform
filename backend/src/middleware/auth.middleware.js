const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { AppError } = require("./error.middleware");
const authService = require("../services/auth.service");

// verifies the bearer token and attaches the user to req.user
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "NO_TOKEN", "Missing authorization token"));
  }

  const token = header.slice("Bearer ".length);

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return next(new AppError(401, "INVALID_TOKEN", "Invalid or expired token"));
  }

  try {
    // identity always comes from the verified token, never the request body
    req.user = await authService.getUserById(payload.userId);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
