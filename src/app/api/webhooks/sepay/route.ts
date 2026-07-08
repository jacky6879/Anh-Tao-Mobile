import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { fulfillOrder } from "@/lib/orders";

/**
 * Sepay webhook. Verify HMAC-SHA256 signature header `Sepay-Signature`
 * against the raw body using SEPAY_WEBHOOK_SECRET. Then parse memo to find
 * the order publicCode and match amount.
 *
 * If SEPAY_WEBHOOK_SECRET is empty, log a warning (dev only).
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("sepay-signature") ?? req.headers.get("Sepay-Signature") ?? "";

  if (!env.SEPAY_WEBHOOK_SECRET) {
    console.warn("[sepay] webhook received but SEPAY_WEBHOOK_SECRET not set — skipping verify (dev)");
  } else {
    const expected = createHmac("sha256", env.SEPAY_WEBHOOK_SECRET).update(raw).digest("hex");
    if (!sig || !safeEqual(expected, sig)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: { amount?: number; memo?: string; transactionId?: string };
  try { payload = JSON.parse(raw); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }

  const memo = payload.memo ?? "";
  const match = memo.match(/(ORD-[A-Z0-9]{6})/i);
  if (!match) return NextResponse.json({ ok: true, matched: false, reason: "no code in memo" });

  const publicCode = match[1]!.toUpperCase();
  const order = await prisma.order.findUnique({ where: { publicCode } });
  if (!order) return NextResponse.json({ ok: true, matched: false, reason: "order not found" });
  if (order.status === "paid") return NextResponse.json({ ok: true, matched: true, idempotent: true });

  if (payload.amount != null && payload.amount < order.total) {
    return NextResponse.json({ ok: true, matched: false, reason: "amount mismatch" });
  }

  await fulfillOrder(order.id, null);
  return NextResponse.json({ ok: true, matched: true });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
