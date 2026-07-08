import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND, formatDateTime } from "@/lib/format";

export const metadata = { title: "Dashboard quản trị" };

export default async function AdminDashboard() {
  let stats = { products: 0, orders: 0, pendingOrders: 0, bookings: 0, tradeIns: 0, leads: 0, revenue: 0 };
  let recentOrders: { id: string; publicCode: string; buyerName: string; total: number; status: string; createdAt: Date }[] = [];

  try {
    const [products, orders, pendingOrders, bookings, tradeIns, leads, paidOrdersAgg, recent] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.repairBooking.count({ where: { status: "pending" } }),
      prisma.tradeInRequest.count({ where: { status: "pending" } }),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.order.aggregate({ where: { status: "paid" }, _sum: { total: true } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, publicCode: true, buyerName: true, total: true, status: true, createdAt: true } }),
    ]);
    stats = { products, orders, pendingOrders, bookings, tradeIns, leads, revenue: paidOrdersAgg._sum.total ?? 0 };
    recentOrders = recent;
  } catch { /* DB */ }

  const cards = [
    { label: "Sản phẩm", value: stats.products, href: "/admin/products" },
    { label: "Đơn chờ xác nhận", value: stats.pendingOrders, href: "/admin/orders?status=pending" },
    { label: "Lịch sửa chờ", value: stats.bookings, href: "/admin/bookings" },
    { label: "Thu cũ chờ", value: stats.tradeIns, href: "/admin/trade-in" },
    { label: "Leads mới", value: stats.leads, href: "/admin/leads" },
    { label: "Doanh thu đã thu", value: formatVND(stats.revenue), href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="surface-card p-4 hover:shadow-lg transition">
            <div className="text-xs text-muted-token uppercase">{c.label}</div>
            <div className="text-xl font-bold mt-1">{c.value}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">Đơn gần đây</h2>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr>
              <th className="p-3">Mã</th><th className="p-3">Khách</th><th className="p-3">Tổng</th><th className="p-3">Trạng thái</th><th className="p-3">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 && <tr><td colSpan={5} className="p-4 text-muted-token text-center">Chưa có đơn</td></tr>}
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-t border-token">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="text-[var(--brand-primary)] font-mono">{o.publicCode}</Link></td>
                <td className="p-3">{o.buyerName}</td>
                <td className="p-3">{formatVND(o.total)}</td>
                <td className="p-3"><span className="badge badge-muted">{o.status}</span></td>
                <td className="p-3 text-muted-token">{formatDateTime(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
