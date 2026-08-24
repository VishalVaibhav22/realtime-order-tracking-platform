const { z } = require("zod");

const postLocationSchema = z.object({
  orderId: z.string().uuid("invalid order id"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

module.exports = { postLocationSchema };
