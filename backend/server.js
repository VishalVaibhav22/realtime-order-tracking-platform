const http = require("http");
const app = require("./src/app");
const env = require("./src/config/env");
const redisClient = require("./src/config/redis");
const { initSocket } = require("./src/websocket/socket");

async function start() {
  await redisClient.connect();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`Backend server running on port ${env.PORT}`);
  });
}

start();
