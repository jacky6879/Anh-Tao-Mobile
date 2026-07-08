import { prisma } from "@/lib/db";
import type { Coupon } from "@prisma/client";

export interface CouponContext {
  subtotal: number;
  productIds: string[];
  userId?: string | null;
}

export interface CouponResult {
  ok: boolean;
  discount: number;
  reason?: string;
  coupon?: Coupon;
}

export async function validateCoupon(code: string, ctx: CouponContext): Promise<CouponResult> {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) return { ok: false, discount: 0, reason: "Mã không hợp lệ" };

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) return { ok: false, discount: 0, reason: "Mã chưa hiệu lực" };
  if (coupon.expiresAt && now > coupon.expiresAt) return { ok: false, discount: 0, reason: "Mã đã hết hạn" };
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
    return { ok: false, discount: 0, reason: "Mã đã hết lượt dùng" };
  if (coupon.minOrderAmount && ctx.subtotal < coupon.minOrderAmount)
    return { ok: false, discount: 0, reason: `Đơn tối thiểu ${coupon.minOrderAmount.toLocaleString("vi-VN")}₫` };

  if (coupon.productIds.length > 0) {
    const match = ctx.productIds.some((id) => coupon.productIds.includes(id));
    if (!match) return { ok: false, discount: 0, reason: "Mã không áp dụng cho sản phẩm này" };
  }

  if (coupon.perUserLimit && ctx.userId) {
    const used = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId: ctx.userId },
    });
    if (used >= coupon.perUserLimit) return { ok: false, discount: 0, reason: "Bạn đã dùng mã này" };
  }

  let discount: number;
  if (coupon.type === "percent") {
    discount = Math.floor((ctx.subtotal * coupon.value) / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = Math.min(coupon.value, ctx.subtotal);
  }

  return { ok: true, discount, coupon };
}
