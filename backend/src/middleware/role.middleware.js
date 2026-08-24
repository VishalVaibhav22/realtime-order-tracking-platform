const { AppError } = require("./error.middleware");

// auth.middleware must run first so req.user is already set
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, "FORBIDDEN", "You do not have access to this resource"),
      );
    }
    next();
  };
}

module.exports = requireRole;
