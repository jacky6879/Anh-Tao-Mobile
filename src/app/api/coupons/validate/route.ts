import { NextResponse } from "next/server";
import { z } from "zod";
import { validateCoupon } from "@/lib/coupons";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().int().min(0),
  productIds: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`coupon:${ip}`, 20, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });

  const result = await validateCoupon(parsed.data.code, { subtotal: parsed.data.subtotal, productIds: parsed.data.productIds });
  if (!result.ok) return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });

  return NextResponse.json({ ok: true, discount: result.discount });
}
