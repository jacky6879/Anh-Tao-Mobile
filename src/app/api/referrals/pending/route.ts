import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";
import { computeCommission } from "@/lib/referral";

const schema = z.object({
  referralCode: z.string().min(4).max(12),
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().optional(),
  amount: z.number().int().min(0),
});

/** Fallback referral capture when Sepay webhook isn't used. Dedupe 24h. */
export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`referral:${ip}`, 5, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });

  const d = parsed.data;
  const referrer = await prisma.user.findUnique({ where: { referralCode: d.referralCode } });
  if (!referrer) return NextResponse.json({ error: "Mã giới thiệu không tồn tại" }, { status: 400 });
  if (referrer.email === d.buyerEmail) return NextResponse.json({ ok: true, self: true });

  // Dedupe within 24h by referralCode + buyerEmail.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.referral.findFirst({
    where: { referralCode: d.referralCode, buyerEmail: d.buyerEmail, createdAt: { gt: since } },
  });
  if (existing) return NextResponse.json({ ok: true, dedupe: true });

  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referralCode: d.referralCode,
      buyerName: d.buyerName,
      buyerEmail: d.buyerEmail,
      buyerPhone: d.buyerPhone,
      amount: d.amount,
      commission: computeCommission(d.amount),
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true });
}
