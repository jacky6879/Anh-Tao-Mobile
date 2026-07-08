import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/schemas";
import { generatePublicCode } from "@/lib/orders";
import { getClientIp } from "@/lib/ip";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = await getClientIp();
  const rl = await rateLimit(`booking:${ip}`, 5, 60);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });

  const d = parsed.data;
  const booking = await prisma.repairBooking.create({
    data: {
      publicCode: generatePublicCode("BK"),
      serviceId: d.serviceId,
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      customerEmail: d.customerEmail || null,
      deviceBrand: d.deviceBrand,
      deviceModel: d.deviceModel,
      fault: d.fault,
      desiredService: d.desiredService,
      scheduledAt: d.scheduledAt ? new Date(d.scheduledAt) : null,
      note: d.note,
      ipAddress: ip,
    },
  });

  // Also create a lead for the CRM.
  await prisma.lead.create({
    data: {
      type: "repair",
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      customerEmail: d.customerEmail || null,
      message: d.fault,
      ipAddress: ip,
    },
  }).catch(() => {});

  return NextResponse.json({ ok: true, publicCode: booking.publicCode });
}
