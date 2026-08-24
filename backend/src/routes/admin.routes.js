const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { listOrdersQuerySchema } = require("../validators/order.validator");

const router = express.Router();

router.use(authMiddleware, requireRole("ADMIN"));

router.get("/orders", validate(listOrdersQuerySchema, "query"), adminController.listOrders);
router.get("/drivers", adminController.listDrivers);

module.exports = router;
