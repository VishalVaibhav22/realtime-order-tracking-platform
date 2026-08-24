const { createClient } = require("redis");
const env = require("./env");

const client = createClient({ url: env.REDIS_URL });

client.on("error", (err) => {
  console.error("Redis client error", err);
});

module.exports = client;
