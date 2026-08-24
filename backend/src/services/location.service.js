const prisma = require("../config/prisma");
const { AppError } = require("../middleware/error.middleware");

// location pings are only accepted while the order is actually moving
const TRACKABLE_STATUSES = ["PICKED_UP", "IN_TRANSIT"];

async function recordLocation(user, { orderId, latitude, longitude }) {
  if (!user.driverProfile) {
    throw new AppError(403, "NO_DRIVER_PROFILE", "This account has no driver profile");
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  // covers both an unassigned order and one assigned to a different driver
  if (order.driverId !== user.driverProfile.id) {
    throw new AppError(403, "FORBIDDEN", "This order is not assigned to you");
  }

  if (!TRACKABLE_STATUSES.includes(order.status)) {
    throw new AppError(
      409,
      "ORDER_NOT_TRACKABLE",
      `Cannot record location while order is ${order.status}`,
    );
  }

  // phase 4 on purpose - every single ping becomes a row, no throttling yet
  await prisma.locationHistory.create({
    data: {
      orderId,
      driverId: user.driverProfile.id,
      latitude,
      longitude,
    },
  });
}

// phase 4 on purpose - current location is just the newest history row
async function getLatestLocation(orderId) {
  const location = await prisma.locationHistory.findFirst({
    where: { orderId },
    orderBy: { recordedAt: "desc" },
  });

  return location;
}

module.exports = { recordLocation, getLatestLocation };
