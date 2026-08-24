// runs a zod schema against req.body, req.query or req.params
function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: result.error.issues.map((issue) => issue.message).join(", "),
        },
      });
    }

    req[source] = result.data;
    next();
  };
}

module.exports = validate;
