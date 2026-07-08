import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/schemas";
import { generatePublicCode, buildPaymentMemo } from "@/lib/orders";
import { validateCoupon } from "@/lib/coupons";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`checkout:${ip}`, 5, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu, thử lại sau" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 }); }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const data = parsed.data;
  const items = (body as { items?: { productId: string; qty: number }[] }).items ?? [];

  // Fetch real prices server-side.
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, status: "published", deletedAt: null },
    select: { id: true, title: true, price: true, stock: true },
  });

  if (products.length === 0) return NextResponse.json({ error: "Không có sản phẩm hợp lệ" }, { status: 400 });

  const lines = items
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      return p ? { productId: p.id, title: p.title, price: p.price, qty: Math.max(1, Math.min(99, i.qty)) } : null;
    })
    .filter(Boolean) as { productId: string; title: string; price: number; qty: number }[];

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  let discount = 0;
  let couponCode: string | null = null;
  if (data.couponCode) {
    const coupon = await validateCoupon(data.couponCode, { subtotal, productIds: lines.map((l) => l.productId) });
    if (!coupon.ok) return NextResponse.json({ error: coupon.reason ?? "Mã giảm giá không hợp lệ" }, { status: 400 });
    discount = coupon.discount;
    couponCode = coupon.coupon!.code;
  }

  const total = Math.max(0, subtotal - discount);
  const publicCode = generatePublicCode();
  const paymentMemo = buildPaymentMemo(publicCode, data.referralCode, data.buyerEmail);

  const order = await prisma.order.create({
    data: {
      publicCode,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      buyerPhone: data.buyerPhone,
      buyerAddress: data.buyerAddress,
      fulfillment: data.fulfillment,
      subtotal,
      discount,
      total,
      status: "pending",
      paymentMemo,
      couponCode,
      referralCode: data.referralCode,
      note: data.note,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddress: ip,
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          productTitleSnap: l.title,
          priceSnap: l.price,
          qty: l.qty,
        })),
      },
    },
  });

  return NextResponse.json({ publicCode: order.publicCode, paymentMemo, total, expiresAt: order.expiresAt });
}
