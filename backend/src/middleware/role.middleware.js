const { AppError } = require("./error.middleware");

// auth.middleware must run first so req.user is already set
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(
        new AppError(403, "FORBIDDEN", "You do not have access to this resource"),
      );
    }
    next();
  };
}

module.exports = requireRole;
