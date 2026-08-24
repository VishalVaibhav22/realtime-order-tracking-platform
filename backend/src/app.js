const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const driverRoutes = require("./routes/driver.routes");
const adminRoutes = require("./routes/admin.routes");
const { errorHandler } = require("./middleware/error.middleware");
const env = require("./config/env");

const app = express();

// same permissive origin already used for socket.io - the frontend is
// served from its own origin (vite dev proxy locally, a separate nginx
// container in docker), so the api needs cors enabled either way
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", instanceId: env.INSTANCE_ID });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
