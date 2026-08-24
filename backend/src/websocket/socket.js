const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const env = require("../config/env");
const prisma = require("../config/prisma");
const redis = require("../config/redis");
const authService = require("../services/auth.service");

const orderIdSchema = z.string().uuid();

// module-level so getIO() can hand out the same instance everywhere
let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Missing authorization token"));
    }

    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }

    try {
      socket.user = await authService.getUserById(payload.userId);
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[${env.INSTANCE_ID}] socket connected: ${socket.id}`);

    socket.on("join_order", (data, callback) => joinOrder(socket, data, callback));
    socket.on("leave_order", (data) => leaveOrder(socket, data));

    socket.on("disconnect", () => {
      console.log(`[${env.INSTANCE_ID}] socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

async function joinOrder(socket, data, callback) {
  const ack = typeof callback === "function" ? callback : () => {};
  const result = orderIdSchema.safeParse(data && data.orderId);

  if (!result.success) {
    socket.emit("error", { code: "VALIDATION_ERROR", message: "invalid order id" });
    return ack({ success: false });
  }

  const orderId = result.data;
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    socket.emit("error", { code: "ORDER_NOT_FOUND", message: "Order not found" });
    return ack({ success: false });
  }

  const user = socket.user;
  const canJoin =
    user.role === "ADMIN" ||
    (user.role === "CUSTOMER" && order.customerId === user.id) ||
    (user.role === "DRIVER" && order.driverId === user.driverProfile?.id);

  if (!canJoin) {
    socket.emit("error", { code: "FORBIDDEN", message: "You do not have access to this order" });
    return ack({ success: false });
  }

  socket.join(`order:${orderId}`);
  ack({ success: true });

  // send the current redis location right away, no waiting for the next ping
  if (order.driverId) {
    const raw = await redis.client.get(`driver:${order.driverId}:location`);
    if (raw) {
      socket.emit("LOCATION_UPDATE", JSON.parse(raw));
    }
  }
}

function leaveOrder(socket, data) {
  const result = orderIdSchema.safeParse(data && data.orderId);

  if (!result.success) {
    socket.emit("error", { code: "VALIDATION_ERROR", message: "invalid order id" });
    return;
  }

  socket.leave(`order:${result.data}`);
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
