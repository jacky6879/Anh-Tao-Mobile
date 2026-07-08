import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const status = url.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(from || to ? { createdAt: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { publicCode: true, buyerName: true, buyerEmail: true, buyerPhone: true, total: true, status: true, createdAt: true },
  });

  const header = ["Mã", "Khách", "Email", "SĐT", "Tổng", "Trạng thái", "Ngày"];
  const rows = orders.map((o) => [o.publicCode, o.buyerName, o.buyerEmail, o.buyerPhone, o.total, o.status, o.createdAt.toISOString()]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${today}.csv"`,
    },
  });
}
