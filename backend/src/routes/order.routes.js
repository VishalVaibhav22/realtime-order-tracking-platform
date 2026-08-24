const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createOrderSchema,
  updateStatusSchema,
  orderIdParamSchema,
  listOrdersQuerySchema,
} = require("../validators/order.validator");

const router = express.Router();

router.use(authMiddleware);

router.post("/", requireRole("CUSTOMER"), validate(createOrderSchema), orderController.create);

router.get(
  "/",
  requireRole("CUSTOMER"),
  validate(listOrdersQuerySchema, "query"),
  orderController.list,
);

router.get(
  "/:id",
  requireRole("CUSTOMER", "DRIVER", "ADMIN"),
  validate(orderIdParamSchema, "params"),
  orderController.getById,
);

router.patch(
  "/:id/accept",
  requireRole("DRIVER"),
  validate(orderIdParamSchema, "params"),
  orderController.accept,
);

router.patch(
  "/:id/status",
  requireRole("DRIVER", "ADMIN"),
  validate(orderIdParamSchema, "params"),
  validate(updateStatusSchema),
  orderController.updateStatus,
);

module.exports = router;
