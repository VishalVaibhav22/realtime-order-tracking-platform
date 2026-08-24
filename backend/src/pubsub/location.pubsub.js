const redis = require("../config/redis");
const env = require("../config/env");
const { getIO } = require("../websocket/socket");

const LOCATION_CHANNEL = "location-updates";
const STATUS_CHANNEL = "status-updates";

async function publishLocationUpdate(payload) {
  await redis.client.publish(LOCATION_CHANNEL, JSON.stringify(payload));
  console.log(`[${env.INSTANCE_ID}] published location update for order ${payload.orderId}`);
}

async function publishStatusUpdate(payload) {
  await redis.client.publish(STATUS_CHANNEL, JSON.stringify(payload));
  console.log(`[${env.INSTANCE_ID}] published status update for order ${payload.orderId}`);
}

// every instance runs this, including the one that published the message
async function startSubscriber() {
  await redis.subscriber.subscribe(LOCATION_CHANNEL, (message) => {
    const { driverId, ...payload } = JSON.parse(message);
    console.log(`[${env.INSTANCE_ID}] received location update for order ${payload.orderId}`);

    const io = getIO();
    if (io) {
      io.to(`order:${payload.orderId}`).emit("LOCATION_UPDATE", payload);
    }
  });
  console.log(`[${env.INSTANCE_ID}] subscribed to ${LOCATION_CHANNEL}`);

  await redis.subscriber.subscribe(STATUS_CHANNEL, (message) => {
    const payload = JSON.parse(message);
    console.log(`[${env.INSTANCE_ID}] received status update for order ${payload.orderId}`);

    const io = getIO();
    if (io) {
      io.to(`order:${payload.orderId}`).emit("STATUS_UPDATE", payload);
    }
  });
  console.log(`[${env.INSTANCE_ID}] subscribed to ${STATUS_CHANNEL}`);
}

module.exports = { publishLocationUpdate, publishStatusUpdate, startSubscriber };
