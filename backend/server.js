const app = require("./src/app");
const env = require("./src/config/env");
const redisClient = require("./src/config/redis");

async function start() {
  await redisClient.connect();

  app.listen(env.PORT, () => {
    console.log(`Backend server running on port ${env.PORT}`);
  });
}

start();
