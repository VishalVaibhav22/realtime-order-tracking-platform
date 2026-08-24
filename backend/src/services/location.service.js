const prisma = require("../config/prisma");
const redis = require("../config/redis");
const env = require("../config/env");
const { AppError } = require("../middleware/error.middleware");
const { getIO } = require("../websocket/socket");

// location pings are only accepted while the order is actually moving
const TRACKABLE_STATUSES = ["PICKED_UP", "IN_TRANSIT"];

// the throttle key itself just needs to outlive one delivery, not be tunable
const THROTTLE_KEY_TTL_SECONDS = 3600;

function locationKey(driverId) {
  return `driver:${driverId}:location`;
}

function throttleKey(orderId) {
  return `order:${orderId}:lastPersistedAt`;
}

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

  const driverId = user.driverProfile.id;

  // every ping, always - this is the hot current-location write
  const payload = {
    orderId,
    latitude,
    longitude,
    timestamp: new Date().toISOString(),
  };
  await redis.set(locationKey(driverId), JSON.stringify(payload), {
    EX: env.LOCATION_TTL_SECONDS,
  });

  await writeHistoryIfDue(orderId, driverId, latitude, longitude);

  // single backend instance for now, so a direct emit reaches every subscribed socket
  const io = getIO();
  if (io) {
    io.to(`order:${orderId}`).emit("LOCATION_UPDATE", payload);
  }
}

// only insert a LocationHistory row if enough time has passed since the last one
async function writeHistoryIfDue(orderId, driverId, latitude, longitude) {
  const lastPersistedAt = await redis.get(throttleKey(orderId));
  const now = Date.now();

  const dueForWrite =
    !lastPersistedAt || now - Number(lastPersistedAt) >= env.HISTORY_THROTTLE_SECONDS * 1000;

  if (!dueForWrite) {
    return;
  }

  await prisma.locationHistory.create({
    data: { orderId, driverId, latitude, longitude },
  });

  await redis.set(throttleKey(orderId), String(now), { EX: THROTTLE_KEY_TTL_SECONDS });
}

// current location always comes from redis, never from LocationHistory
async function getLatestLocation(driverId) {
  if (!driverId) {
    return null;
  }

  const raw = await redis.get(locationKey(driverId));
  return raw ? JSON.parse(raw) : null;
}

module.exports = { recordLocation, getLatestLocation };
