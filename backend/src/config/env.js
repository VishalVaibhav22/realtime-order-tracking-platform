require("dotenv").config();

const fallbackDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/realtime_order_tracking";

const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || fallbackDatabaseUrl,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  LOCATION_TTL_SECONDS: Number(process.env.LOCATION_TTL_SECONDS) || 120,
  HISTORY_THROTTLE_SECONDS: Number(process.env.HISTORY_THROTTLE_SECONDS) || 15,
};

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. Using local default for development:",
    env.DATABASE_URL,
  );
}

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Using an insecure default for development only");
}

module.exports = env;
