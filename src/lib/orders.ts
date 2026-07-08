import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmail, orderConfirmedHtml } from "@/lib/email";
import { writeAudit } from "@/lib/audit";

export function generatePublicCode(prefix = "ORD"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) out += alphabet[bytes[i]! % alphabet.length];
  return `${prefix}-${out}`;
}

export function buildPaymentMemo(publicCode: string, referralCode?: string | null, emailLocal?: string): string {
  const tag = referralCode || emailLocal?.split("@")[0] || "ANHTAO";
  const memo = `${publicCode} ${tag}`.replace(/\s+/g, " ").trim();
  return memo.slice(0, 25);
}

export function buildSepayQrUrl(amount: number, memo: string): string {
  const params = new URLSearchParams({
    bank: env.SEPAY_BANK,
    acc: env.SEPAY_ACCOUNT,
    amount: String(amount),
    des: memo,
  });
  return `https://qr.sepay.vn/img?${params.toString()}`;
}

/**
 * Confirm an order's payment + fulfil reservation. Runs in one transaction:
 * mark paid, increment salesCount, attach referral, bump coupon usage,
 * fire email, write audit. Throws on idempotency conflict.
 */
export async function fulfillOrder(orderId: string, adminId: string | null): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
    if (order.status === "paid") return; // idempotent
    if (order.status === "cancelled" || order.status === "refunded") {
      throw new Error(`Cannot fulfill order in status ${order.status}`);
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: "paid", paidAt: new Date(), paidBy: adminId },
    });

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { salesCount: { increment: item.qty }, stock: { decrement: item.qty } },
      });
    }

    if (order.referralCode) {
      const referrer = await tx.user.findUnique({ where: { referralCode: order.referralCode } });
      if (referrer && referrer.id !== order.userId && referrer.email !== order.buyerEmail) {
        const commission = Math.floor(order.total * env.REFERRAL_RATE);
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referralCode: order.referralCode,
            orderId: order.id,
            buyerName: order.buyerName,
            buyerEmail: order.buyerEmail,
            buyerPhone: order.buyerPhone,
            amount: order.total,
            commission,
            status: "pending",
          },
        }).catch(() => {/* unique on orderId: already tracked */});
      }
    }

    if (order.couponCode) {
      await tx.coupon.updateMany({
        where: { code: order.couponCode },
        data: { usageCount: { increment: 1 } },
      });
    }

    await writeAudit({
      userId: adminId,
      action: "confirm",
      entityType: "Order",
      entityId: orderId,
      metadata: { publicCode: order.publicCode, total: order.total },
    });
  });

  // Email — fire-and-forget, never roll back the transaction above.
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (order) {
    void sendEmail({
      to: order.buyerEmail,
      subject: `Xác nhận đơn hàng ${order.publicCode} — Anh Táo Mobile`,
      html: orderConfirmedHtml({
        publicCode: order.publicCode,
        buyerName: order.buyerName,
        total: order.total,
        memo: order.paymentMemo ?? undefined,
        qrUrl: order.paymentMemo ? buildSepayQrUrl(order.total, order.paymentMemo) : undefined,
      }),
    });
  }
}

/** Mark pending orders past their expiry as expired (cron). */
export async function expirePendingOrders(): Promise<number> {
  const result = await prisma.order.updateMany({
    where: { status: "pending", expiresAt: { lt: new Date() } },
    data: { status: "expired" },
  });
  return result.count;
}
