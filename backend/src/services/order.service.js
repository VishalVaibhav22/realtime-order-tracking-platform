const prisma = require("../config/prisma");
const { AppError } = require("../middleware/error.middleware");
const locationService = require("./location.service");
const { publishStatusUpdate } = require("../pubsub/location.pubsub");

// an order counts as "active" for a driver's order list
const ACTIVE_STATUSES = ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"];

// which statuses an order in a given status is allowed to move to next
const TRANSITIONS = {
  PLACED: ["ACCEPTED"],
  ACCEPTED: ["PICKED_UP"],
  PICKED_UP: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED", "FAILED"],
  DELIVERED: [],
  FAILED: [],
};

async function createOrder(customerId, data) {
  const order = await prisma.order.create({
    data: {
      customerId,
      status: "PLACED",
      ...data,
    },
  });

  return order;
}

async function listOrders(customerId, status) {
  const orders = await prisma.order.findMany({
    where: {
      customerId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

async function getOrderById(orderId, user) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  // admin can view any order, a customer only their own
  if (user.role === "CUSTOMER" && order.customerId !== user.id) {
    throw new AppError(403, "FORBIDDEN", "This order does not belong to you");
  }

  const location = await locationService.getLatestLocation(order.driverId);

  return { ...order, location };
}

async function listOrdersForDriver(user) {
  if (!user.driverProfile) {
    throw new AppError(403, "NO_DRIVER_PROFILE", "This account has no driver profile");
  }

  const orders = await prisma.order.findMany({
    where: { driverId: user.driverProfile.id },
    orderBy: { createdAt: "desc" },
  });

  const active = orders.filter((order) => ACTIVE_STATUSES.includes(order.status));
  const rest = orders.filter((order) => !ACTIVE_STATUSES.includes(order.status));

  return [...active, ...rest];
}

async function acceptOrder(orderId, user) {
  if (!user.driverProfile) {
    throw new AppError(
      403,
      "NO_DRIVER_PROFILE",
      "This account has no driver profile",
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  // a PLACED order never has a driver yet, so this one check covers both
  // "already accepted" and "wrong status to accept"
  if (order.status !== "PLACED") {
    throw new AppError(
      409,
      "ORDER_ALREADY_ACCEPTED",
      `Cannot accept order from status ${order.status}`,
    );
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      driverId: user.driverProfile.id,
      status: "ACCEPTED",
    },
  });

  await publishStatusUpdate({
    orderId,
    status: "ACCEPTED",
    previousStatus: "PLACED",
    timestamp: new Date().toISOString(),
  });

  return updated;
}

async function updateStatus(orderId, user, newStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (user.role === "DRIVER" && order.driverId !== user.driverProfile?.id) {
    throw new AppError(403, "FORBIDDEN", "This order is not assigned to you");
  }

  const allowedNext = TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(
      409,
      "INVALID_TRANSITION",
      `Cannot move order from ${order.status} to ${newStatus}`,
    );
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      deliveredAt: newStatus === "DELIVERED" ? new Date() : order.deliveredAt,
    },
  });

  await publishStatusUpdate({
    orderId,
    status: newStatus,
    previousStatus: order.status,
    timestamp: new Date().toISOString(),
  });

  return updated;
}

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  listOrdersForDriver,
  acceptOrder,
  updateStatus,
};
