import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { formatDateTime } from "@/lib/format";
import { StatusForm } from "@/components/admin/StatusForm";

export const metadata = { title: "Leads — Quản trị" };

const STATUSES = ["new", "contacted", "converted", "lost"];
const TYPE_LABEL: Record<string, string> = { buy: "Mua", hold: "Giữ máy", repair: "Sửa chữa", tradein: "Thu cũ", consult: "Tư vấn" };

export default async function AdminLeadsPage() {
  let leads: Awaited<ReturnType<typeof list>> = [];
  try { leads = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Khách hàng / Leads</h1>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr><th className="p-3">Loại</th><th className="p-3">Khách</th><th className="p-3">SĐT</th><th className="p-3">Nội dung</th><th className="p-3">Trạng thái</th><th className="p-3">Ngày</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {leads.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-muted-token">Chưa có lead</td></tr>}
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-token">
                <td className="p-3"><span className="badge badge-info">{TYPE_LABEL[l.type] ?? l.type}</span></td>
                <td className="p-3">{l.customerName}</td>
                <td className="p-3">{l.customerPhone}</td>
                <td className="p-3 max-w-xs truncate text-secondary-token">{l.message ?? "—"}</td>
                <td className="p-3"><span className="badge badge-muted">{l.status}</span></td>
                <td className="p-3 text-muted-token">{formatDateTime(l.createdAt)}</td>
                <td className="p-3">
                  <form action={updateLead.bind(null, l.id)} className="flex gap-1">
                    <StatusForm name="status" defaultValue={l.status} options={STATUSES} />
                  </form>
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
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, type: true, customerName: true, customerPhone: true, message: true, status: true, createdAt: true } });
}

export async function updateLead(id: string, formData: FormData) {
  "use server";
  const session = await requireAdmin();
  const status = String(formData.get("status") ?? "new") as "new" | "contacted" | "converted" | "lost";
  await prisma.lead.update({ where: { id }, data: { status } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "update", entityType: "Lead", entityId: id, metadata: { status } } });
  revalidatePath("/admin/leads");
}
