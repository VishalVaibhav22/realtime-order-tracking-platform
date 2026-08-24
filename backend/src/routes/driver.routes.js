const express = require("express");
const driverController = require("../controllers/driver.controller");
const authMiddleware = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { postLocationSchema } = require("../validators/location.validator");

const router = express.Router();

router.use(authMiddleware, requireRole("DRIVER"));

router.post("/location", validate(postLocationSchema), driverController.postLocation);
router.get("/orders", driverController.listOrders);

module.exports = router;
