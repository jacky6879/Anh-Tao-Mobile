import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/format";

export default async function DashboardHome() {
  const session = await auth();
  let orderCount = 0;
  let totalSpent = 0;
  let commission = 0;
  try {
    const [agg, refs] = await Promise.all([
      prisma.order.aggregate({ where: { userId: session!.user.id, status: { in: ["paid", "confirmed"] } }, _sum: { total: true }, _count: { _all: true } }),
      prisma.referral.aggregate({ where: { referrerId: session!.user.id, status: "confirmed" }, _sum: { commission: true } }),
    ]);
    orderCount = agg._count._all;
    totalSpent = agg._sum.total ?? 0;
    commission = refs._sum.commission ?? 0;
  } catch { /* DB */ }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="surface-card p-4"><div className="text-xs text-muted-token uppercase">Đơn đã mua</div><div className="text-xl font-bold mt-1">{orderCount}</div></div>
      <div className="surface-card p-4"><div className="text-xs text-muted-token uppercase">Tổng chi</div><div className="text-xl font-bold mt-1">{formatVND(totalSpent)}</div></div>
      <div className="surface-card p-4"><div className="text-xs text-muted-token uppercase">Hoa hồng giới thiệu</div><div className="text-xl font-bold mt-1 text-[var(--brand-primary)]">{formatVND(commission)}</div></div>
      <div className="surface-card p-4 flex items-center"><Link href="/dashboard/orders" className="btn btn-secondary">Xem đơn hàng</Link></div>
    </div>
  );
}
