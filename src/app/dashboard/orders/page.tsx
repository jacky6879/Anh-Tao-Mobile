import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatVND, formatDateTime } from "@/lib/format";

const STATUS_CLS: Record<string, string> = { pending: "badge-warning", paid: "badge-success", confirmed: "badge-success", cancelled: "badge-danger", refunded: "badge-danger", expired: "badge-muted" };

export default async function DashboardOrdersPage() {
  const session = await auth();
  let orders: Awaited<ReturnType<typeof list>> = [];
  try { orders = await list(session!.user.id); } catch { /* DB */ }

  return (
    <div>
      <h2 className="font-bold mb-3">Đơn hàng của bạn</h2>
      <div className="flex flex-col gap-2">
        {orders.length === 0 && <p className="text-muted-token text-sm">Chưa có đơn hàng.</p>}
        {orders.map((o) => (
          <Link key={o.id} href={`/order/${o.publicCode}`} className="surface-card p-3 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="font-mono text-sm">{o.publicCode}</p>
              <p className="text-xs text-muted-token">{formatDateTime(o.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatVND(o.total)}</p>
              <span className={`badge ${STATUS_CLS[o.status] ?? "badge-muted"}`}>{o.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function list(userId: string) {
  return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { id: true, publicCode: true, total: true, status: true, createdAt: true } });
}
