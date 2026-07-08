import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { formatVND, formatDateTime } from "@/lib/format";
import { StatusForm } from "@/components/admin/StatusForm";

export const metadata = { title: "Thu cũ đổi mới — Quản trị" };

const STATUSES = ["pending", "reviewed", "offered", "rejected", "completed"];

export default async function AdminTradeInPage() {
  let items: Awaited<ReturnType<typeof list>> = [];
  try { items = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thu cũ đổi mới</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 && <p className="text-muted-token">Chưa có yêu cầu thu cũ.</p>}
        {items.map((t) => (
          <div key={t.id} className="surface-card p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-mono text-xs text-muted-token">{t.publicCode}</p>
                <p className="font-semibold">{t.customerName} · {t.customerPhone}</p>
              </div>
              <span className="badge badge-muted">{t.status}</span>
            </div>
            <p className="text-sm"><b>Máy cũ:</b> {t.currentDevice} {t.storage ? `· ${t.storage}` : ""}</p>
            {t.batteryHealth && <p className="text-sm text-secondary-token"><b>Pin:</b> {t.batteryHealth}</p>}
            {t.cosmetic && <p className="text-sm text-secondary-token"><b>Ngoại hình:</b> {t.cosmetic}</p>}
            {t.wantedDevice && <p className="text-sm text-secondary-token"><b>Muốn lên đời:</b> {t.wantedDevice}</p>}
            {t.offeredPrice != null && <p className="text-sm"><b>Giá thu:</b> {formatVND(t.offeredPrice)}</p>}
            <p className="text-xs text-muted-token mt-1">{formatDateTime(t.createdAt)}</p>
            <form action={updateTradeIn.bind(null, t.id)} className="flex gap-2 mt-3">
              <StatusForm name="status" defaultValue={t.status} options={STATUSES} />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

async function list() {
  return prisma.tradeInRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, publicCode: true, customerName: true, customerPhone: true, currentDevice: true, storage: true, batteryHealth: true, cosmetic: true, wantedDevice: true, offeredPrice: true, status: true, createdAt: true },
  });
}

export async function updateTradeIn(id: string, formData: FormData) {
  "use server";
  const session = await requireAdmin();
  const status = String(formData.get("status") ?? "pending") as "pending" | "reviewed" | "offered" | "rejected" | "completed";
  await prisma.tradeInRequest.update({ where: { id }, data: { status } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "update", entityType: "TradeInRequest", entityId: id, metadata: { status } } });
  revalidatePath("/admin/trade-in");
}
