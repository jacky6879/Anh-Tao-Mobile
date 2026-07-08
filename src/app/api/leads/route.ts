import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/schemas";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`lead:${ip}`, 10, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });

  const d = parsed.data;
  await prisma.lead.create({
    data: {
      type: d.type,
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      customerEmail: d.customerEmail || null,
      message: d.message,
      productId: d.productId,
      source: d.source,
      ipAddress: ip,
    },
  });

  return NextResponse.json({ ok: true });
}
