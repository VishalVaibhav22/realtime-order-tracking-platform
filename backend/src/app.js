const express = require("express");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const requireRole = require("./middleware/role.middleware");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

// temporary route to demonstrate role middleware, remove later
app.get("/api/test/driver-only", authMiddleware, requireRole("DRIVER"), (req, res) => {
  res.json({ success: true, data: { message: "hello driver", user: req.user } });
});

app.use(errorHandler);

module.exports = app;
