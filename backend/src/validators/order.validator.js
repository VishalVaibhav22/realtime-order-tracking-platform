const { z } = require("zod");

const orderStatuses = [
  "PLACED",
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "FAILED",
];

const createOrderSchema = z.object({
  pickupAddress: z.string().min(1, "pickupAddress is required"),
  pickupLatitude: z.number().min(-90).max(90),
  pickupLongitude: z.number().min(-180).max(180),
  destinationAddress: z.string().min(1, "destinationAddress is required"),
  destinationLatitude: z.number().min(-90).max(90),
  destinationLongitude: z.number().min(-180).max(180),
});

const updateStatusSchema = z.object({
  status: z.enum(orderStatuses),
});

const orderIdParamSchema = z.object({
  id: z.string().uuid("invalid order id"),
});

const listOrdersQuerySchema = z.object({
  status: z.enum(orderStatuses).optional(),
});

module.exports = {
  orderStatuses,
  createOrderSchema,
  updateStatusSchema,
  orderIdParamSchema,
  listOrdersQuerySchema,
};
