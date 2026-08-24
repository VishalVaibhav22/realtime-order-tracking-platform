const { z } = require("zod");

const registerSchema = z
  .object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "DRIVER", "ADMIN"]),
    vehicleNumber: z.string().min(1).optional(),
  })
  .refine((data) => data.role !== "DRIVER" || !!data.vehicleNumber, {
    message: "vehicleNumber is required for drivers",
    path: ["vehicleNumber"],
  });

const loginSchema = z.object({
  email: z.string().email("invalid email"),
  password: z.string().min(1, "password is required"),
});

module.exports = { registerSchema, loginSchema };
