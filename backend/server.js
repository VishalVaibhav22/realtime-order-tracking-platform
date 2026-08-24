const http = require("http");
const app = require("./src/app");
const env = require("./src/config/env");
const redis = require("./src/config/redis");
const { initSocket } = require("./src/websocket/socket");
const { startSubscriber } = require("./src/pubsub/location.pubsub");

async function start() {
  await redis.client.connect();
  await redis.subscriber.connect();
  console.log(`[${env.INSTANCE_ID}] connected to redis`);

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  await startSubscriber();

  httpServer.listen(env.PORT, () => {
    console.log(`[${env.INSTANCE_ID}] backend server running on port ${env.PORT}`);
  });
}

start();
