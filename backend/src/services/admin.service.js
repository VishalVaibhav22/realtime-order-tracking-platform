const prisma = require("../config/prisma");
const locationService = require("./location.service");

// an order still needs a driver assigned to be someone's "active" delivery
const ACTIVE_STATUSES = ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"];

async function listAllOrders(status) {
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: {
      customer: { select: { id: true, name: true, email: true } },
      driver: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const withLiveState = await Promise.all(
    orders.map(async (order) => {
      const { location, eta } = await locationService.getLocationAndEta(order);
      return { ...order, location, eta };
    }),
  );

  return withLiveState;
}

async function listAllDrivers() {
  const drivers = await prisma.driverProfile.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      orders: {
        where: { status: { in: ACTIVE_STATUSES } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return drivers.map((driver) => ({
    id: driver.id,
    vehicleNumber: driver.vehicleNumber,
    isAvailable: driver.isAvailable,
    user: driver.user,
    activeOrder: driver.orders[0] || null,
  }));
}

module.exports = { listAllOrders, listAllDrivers };
