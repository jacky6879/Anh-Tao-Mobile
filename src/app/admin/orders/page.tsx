import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND, formatDateTime } from "@/lib/format";

export const metadata = { title: "Đơn đặt máy — Quản trị" };

const STATUS_CLS: Record<string, string> = {
  pending: "badge-warning", paid: "badge-success", confirmed: "badge-success",
  cancelled: "badge-danger", refunded: "badge-danger", expired: "badge-muted",
};

type Search = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function AdminOrdersPage({ searchParams }: Search) {
  const sp = await searchParams;
  let orders: Awaited<ReturnType<typeof list>> = [];
  try { orders = await list(sp.status, sp.q); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn đặt máy</h1>

      <form className="flex gap-2 mb-4">
        <select name="status" defaultValue={sp.status ?? ""} className="input-token w-40">
          <option value="">Tất cả trạng thái</option>
          {["pending", "paid", "confirmed", "cancelled", "refunded", "expired"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Mã đơn / email / SĐT" className="input-token flex-1" />
        <button className="btn btn-primary">Lọc</button>
      </form>

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr><th className="p-3">Mã</th><th className="p-3">Khách</th><th className="p-3">SĐT</th><th className="p-3">Tổng</th><th className="p-3">Trạng thái</th><th className="p-3">Ngày</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-token">Chưa có đơn</td></tr>}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-token">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-mono text-[var(--brand-primary)]">{o.publicCode}</Link></td>
                <td className="p-3">{o.buyerName}<div className="text-xs text-muted-token">{o.buyerEmail}</div></td>
                <td className="p-3">{o.buyerPhone}</td>
                <td className="p-3">{formatVND(o.total)}</td>
                <td className="p-3"><span className={`badge ${STATUS_CLS[o.status] ?? "badge-muted"}`}>{o.status}</span></td>
                <td className="p-3 text-muted-token">{formatDateTime(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function list(status?: string, q?: string) {
  return prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [{ publicCode: { contains: q, mode: "insensitive" } }, { buyerEmail: { contains: q, mode: "insensitive" } }, { buyerPhone: { contains: q } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, publicCode: true, buyerName: true, buyerEmail: true, buyerPhone: true, total: true, status: true, createdAt: true },
  });
}
