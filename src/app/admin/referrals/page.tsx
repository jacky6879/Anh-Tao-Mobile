import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { formatVND, formatDateTime } from "@/lib/format";
import { OrderActions } from "@/components/admin/OrderActions";

export const metadata = { title: "Giới thiệu — Quản trị" };

export default async function AdminReferralsPage() {
  let refs: Awaited<ReturnType<typeof list>> = [];
  try { refs = await list(); } catch { /* DB */ }

  const totalCommission = refs.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.commission, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Giới thiệu</h1>
        <span className="text-sm">Hoa hồng đã xác nhận: <b className="text-[var(--brand-primary)]">{formatVND(totalCommission)}</b></span>
      </div>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr><th className="p-3">Mã</th><th className="p-3">Người mua</th><th className="p-3">Doanh số</th><th className="p-3">Hoa hồng</th><th className="p-3">Trạng thái</th><th className="p-3">Ngày</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {refs.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-muted-token">Chưa có referral</td></tr>}
            {refs.map((r) => (
              <tr key={r.id} className="border-t border-token">
                <td className="p-3 font-mono">{r.referralCode}</td>
                <td className="p-3">{r.buyerName}<div className="text-xs text-muted-token">{r.buyerEmail ?? r.buyerPhone}</div></td>
                <td className="p-3">{formatVND(r.amount)}</td>
                <td className="p-3 text-[var(--brand-primary)] font-semibold">{formatVND(r.commission)}</td>
                <td className="p-3"><span className="badge badge-muted">{r.status}</span></td>
                <td className="p-3 text-muted-token">{formatDateTime(r.createdAt)}</td>
                <td className="p-3">
                  {r.status === "pending" && (
                    <OrderActions label="Xác nhận" action={confirmReferral.bind(null, r.id)} variant="primary" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function list() {
  return prisma.referral.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, referralCode: true, buyerName: true, buyerEmail: true, buyerPhone: true, amount: true, commission: true, status: true, createdAt: true },
  });
}

export async function confirmReferral(id: string) {
  "use server";
  const session = await requireAdmin();
  await prisma.referral.update({ where: { id }, data: { status: "confirmed", confirmedAt: new Date(), confirmedBy: session.user.id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "confirm", entityType: "Referral", entityId: id, metadata: {} } });
  revalidatePath("/admin/referrals");
}

