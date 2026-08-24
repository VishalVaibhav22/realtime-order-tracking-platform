const orderService = require("../services/order.service");

async function create(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const orders = await orderService.listOrders(req.user.id, req.query.status);
    res.status(200).json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
}

async function accept(req, res, next) {
  try {
    const order = await orderService.acceptOrder(req.params.id, req.user);
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const order = await orderService.updateStatus(
      req.params.id,
      req.user,
      req.body.status,
    );
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getById, accept, updateStatus };
