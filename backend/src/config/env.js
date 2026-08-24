require("dotenv").config();

const fallbackDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/realtime_order_tracking";

const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || fallbackDatabaseUrl,
};

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. Using local default for development:",
    env.DATABASE_URL,
  );
}

module.exports = env;
