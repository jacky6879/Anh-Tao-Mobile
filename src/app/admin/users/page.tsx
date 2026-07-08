import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import { formatDateTime } from "@/lib/format";
import { UserActions } from "@/components/admin/UserActions";

export const metadata = { title: "Người dùng — Quản trị" };

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof list>> = [];
  try { users = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Người dùng</h1>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr><th className="p-3">Email</th><th className="p-3">Tên</th><th className="p-3">Admin</th><th className="p-3">Trạng thái</th><th className="p-3">Ngày tạo</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-token">Chưa có người dùng</td></tr>}
            {users.map((u) => (
              <tr key={u.id} className="border-t border-token">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3">{u.isAdmin ? <span className="badge badge-info">Admin</span> : "—"}</td>
                <td className="p-3"><span className={`badge ${u.status === "active" ? "badge-success" : "badge-danger"}`}>{u.status}</span></td>
                <td className="p-3 text-muted-token">{formatDateTime(u.createdAt)}</td>
                <td className="p-3">
                  <UserActions
                    isAdmin={u.isAdmin}
                    status={u.status}
                    onToggleAdmin={toggleAdmin.bind(null, u.id)}
                    onToggleBlock={toggleBlock.bind(null, u.id)}
                  />
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
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, email: true, name: true, isAdmin: true, status: true, createdAt: true },
  });
}

export async function toggleAdmin(id: string) {
  "use server";
  const session = await requireAdmin();
  const u = await prisma.user.findUniqueOrThrow({ where: { id } });
  await prisma.user.update({ where: { id }, data: { isAdmin: !u.isAdmin } });
  await writeAudit({ userId: session.user.id, action: !u.isAdmin ? "admin_grant" : "admin_revoke", entityType: "User", entityId: id, metadata: { target: u.email } });
  await setFlash({ type: "success", message: "Đã cập nhật quyền admin" });
  revalidatePath("/admin/users");
}

export async function toggleBlock(id: string) {
  "use server";
  const session = await requireAdmin();
  const u = await prisma.user.findUniqueOrThrow({ where: { id } });
  const status = u.status === "active" ? "blocked" : "active";
  await prisma.user.update({ where: { id }, data: { status } });
  await writeAudit({ userId: session.user.id, action: "update", entityType: "User", entityId: id, metadata: { status, target: u.email } });
  await setFlash({ type: "success", message: `Đã ${status === "blocked" ? "khoá" : "mở khoá"} tài khoản` });
  revalidatePath("/admin/users");
}
