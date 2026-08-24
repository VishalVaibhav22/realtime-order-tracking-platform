const express = require("express");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

module.exports = app;
