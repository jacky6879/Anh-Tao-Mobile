import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { formatDateTime } from "@/lib/format";
import { StatusForm } from "@/components/admin/StatusForm";

export const metadata = { title: "Lịch sửa chữa — Quản trị" };

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default async function AdminBookingsPage() {
  let bookings: Awaited<ReturnType<typeof list>> = [];
  try { bookings = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lịch sửa chữa</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {bookings.length === 0 && <p className="text-muted-token">Chưa có lịch đặt nào.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="surface-card p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-mono text-xs text-muted-token">{b.publicCode}</p>
                <p className="font-semibold">{b.customerName} · {b.customerPhone}</p>
              </div>
              <span className="badge badge-muted">{b.status}</span>
            </div>
            <p className="text-sm text-secondary-token"><b>Lỗi:</b> {b.fault}</p>
            {b.deviceModel && <p className="text-sm text-secondary-token"><b>Máy:</b> {b.deviceModel}</p>}
            {b.scheduledAt && <p className="text-sm text-secondary-token"><b>Giờ:</b> {formatDateTime(b.scheduledAt)}</p>}
            {b.note && <p className="text-sm text-secondary-token"><b>Ghi chú:</b> {b.note}</p>}
            <form action={updateBookingStatus.bind(null, b.id)} className="flex gap-2 mt-3">
              <StatusForm name="status" defaultValue={b.status} options={STATUSES} />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

async function list() {
  return prisma.repairBooking.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, publicCode: true, customerName: true, customerPhone: true, deviceModel: true, fault: true, scheduledAt: true, note: true, status: true },
  });
}

export async function updateBookingStatus(id: string, formData: FormData) {
  "use server";
  const session = await requireAdmin();
  const status = String(formData.get("status") ?? "pending") as "pending" | "confirmed" | "completed" | "cancelled";
  await prisma.repairBooking.update({ where: { id }, data: { status } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "update", entityType: "RepairBooking", entityId: id, metadata: { status } } });
  revalidatePath("/admin/bookings");
}
