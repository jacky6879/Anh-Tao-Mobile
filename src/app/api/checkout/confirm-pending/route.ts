import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ publicCode: z.string().min(1) });

export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`confirm:${ip}`, 10, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Mã đơn không hợp lệ" }, { status: 400 });

  // Flag that the user pressed "I've paid" — admin still confirms.
  await prisma.order.updateMany({
    where: { publicCode: parsed.data.publicCode, status: "pending" },
    data: { note: { set: await appendFlag(parsed.data.publicCode) } },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}

async function appendFlag(publicCode: string): Promise<string | undefined> {
  const order = await prisma.order.findUnique({ where: { publicCode }, select: { note: true } });
  const prev = order?.note ?? "";
  return [prev, "[KH đã bấm xác nhận chuyển khoản]"].filter(Boolean).join(" · ");
}
