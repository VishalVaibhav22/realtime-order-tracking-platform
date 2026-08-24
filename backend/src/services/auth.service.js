const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const env = require("../config/env");
const { AppError } = require("../middleware/error.middleware");

const BCRYPT_COST = 10;

function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

// strip passwordHash before a user object leaves the service
function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

async function register({ name, email, password, role, vehicleNumber }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, "EMAIL_TAKEN", "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      driverProfile:
        role === "DRIVER" ? { create: { vehicleNumber } } : undefined,
    },
    include: { driverProfile: true },
  });

  const token = signToken(user);
  return { user: toPublicUser(user), token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { driverProfile: true },
  });

  // same 401 either way so we never reveal which part was wrong
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const token = signToken(user);
  return { user: toPublicUser(user), token };
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { driverProfile: true },
  });

  if (!user) {
    throw new AppError(401, "INVALID_TOKEN", "Invalid or expired token");
  }

  return toPublicUser(user);
}

module.exports = { register, login, getUserById };
