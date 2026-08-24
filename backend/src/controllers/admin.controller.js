const adminService = require("../services/admin.service");

async function listOrders(req, res, next) {
  try {
    const orders = await adminService.listAllOrders(req.query.status);
    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
}

async function listDrivers(req, res, next) {
  try {
    const drivers = await adminService.listAllDrivers();
    res.status(200).json({ success: true, data: { drivers } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listOrders, listDrivers };
