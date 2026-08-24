// runs a zod schema against the request body
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: result.error.issues.map((issue) => issue.message).join(", "),
        },
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
