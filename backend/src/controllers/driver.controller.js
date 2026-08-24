const locationService = require("../services/location.service");
const orderService = require("../services/order.service");

async function postLocation(req, res, next) {
  try {
    await locationService.recordLocation(req.user, req.body);
    res.status(200).json({ success: true, data: { message: "Location updated" } });
  } catch (err) {
    next(err);
  }
}

async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrdersForDriver(req.user);
    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
}

async function listAvailable(req, res, next) {
  try {
    const orders = await orderService.listAvailableOrders();
    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
}

module.exports = { postLocation, listOrders, listAvailable };
