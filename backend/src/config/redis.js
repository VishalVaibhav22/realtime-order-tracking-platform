const { createClient } = require("redis");
const env = require("./env");

const client = createClient({ url: env.REDIS_URL });

// a connection in subscriber mode can no longer run normal commands
// so publishing and subscribing each need their own connection
const subscriber = client.duplicate();

client.on("error", (err) => {
  console.error("Redis client error", err);
});

subscriber.on("error", (err) => {
  console.error("Redis subscriber error", err);
});

module.exports = { client, subscriber };
