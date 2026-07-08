import { z } from "zod";

const phoneMsg = "Số điện thoại không hợp lệ (9–11 số)";

export const phoneSchema = z
  .string()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(/^(0|\+84)(\d{9,10})$/, phoneMsg);

export const checkoutSchema = z.object({
  buyerName: z.string().min(2, "Vui lòng nhập họ tên"),
  buyerEmail: z.string().email("Email không hợp lệ"),
  buyerPhone: phoneSchema,
  buyerAddress: z.string().optional(),
  fulfillment: z.enum(["at_shop", "shipping", "hold", "consult"]).default("at_shop"),
  couponCode: z.string().optional(),
  referralCode: z.string().optional(),
  note: z.string().max(2000).optional(),
});

export const bookingSchema = z.object({
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  customerPhone: phoneSchema,
  customerEmail: z.string().email().optional().or(z.literal("")),
  deviceBrand: z.string().optional(),
  deviceModel: z.string().optional(),
  fault: z.string().min(2, "Vui lòng mô tả lỗi"),
  desiredService: z.string().optional(),
  scheduledAt: z.string().optional(),
  serviceId: z.string().optional(),
  note: z.string().max(2000).optional(),
});

export const tradeInSchema = z.object({
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  customerPhone: phoneSchema,
  customerEmail: z.string().email().optional().or(z.literal("")),
  currentDevice: z.string().min(2, "Vui lòng nhập dòng máy"),
  storage: z.string().optional(),
  batteryHealth: z.string().optional(),
  cosmetic: z.string().optional(),
  faults: z.string().optional(),
  wantedDevice: z.string().optional(),
  note: z.string().max(2000).optional(),
});

export const leadSchema = z.object({
  type: z.enum(["buy", "hold", "repair", "tradein", "consult"]),
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  customerPhone: phoneSchema,
  customerEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  productId: z.string().optional(),
  source: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(5000).optional(),
});
