import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { tradeInSchema } from "@/lib/schemas";
import { generatePublicCode } from "@/lib/orders";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`tradein:${ip}`, 5, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }

  const parsed = tradeInSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });

  const d = parsed.data;
  const req2 = await prisma.tradeInRequest.create({
    data: {
      publicCode: generatePublicCode("TI"),
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      customerEmail: d.customerEmail || null,
      currentDevice: d.currentDevice,
      storage: d.storage,
      batteryHealth: d.batteryHealth,
      cosmetic: d.cosmetic,
      faults: d.faults,
      wantedDevice: d.wantedDevice,
      note: d.note,
      ipAddress: ip,
    },
  });

  await prisma.lead.create({
    data: {
      type: "tradein",
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      customerEmail: d.customerEmail || null,
      message: `${d.currentDevice} → ${d.wantedDevice ?? "?"}`,
      ipAddress: ip,
    },
  }).catch(() => {});

  return NextResponse.json({ ok: true, publicCode: req2.publicCode });
}
