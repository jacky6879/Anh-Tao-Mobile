import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Nhật ký — Quản trị" };

export default async function AdminAuditLogPage() {
  let logs: Awaited<ReturnType<typeof list>> = [];
  try { logs = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nhật ký hoạt động</h1>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr><th className="p-3">Thời gian</th><th className="p-3">Hành động</th><th className="p-3">Đối tượng</th><th className="p-3">Người dùng</th><th className="p-3">Chi tiết</th></tr>
          </thead>
          <tbody>
            {logs.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-token">Chưa có log</td></tr>}
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-token">
                <td className="p-3 text-muted-token">{formatDateTime(l.createdAt)}</td>
                <td className="p-3"><span className="badge badge-muted">{l.action}</span></td>
                <td className="p-3">{l.entityType} <span className="font-mono text-xs text-muted-token">{l.entityId.slice(0, 8)}</span></td>
                <td className="p-3 text-muted-token">{l.user?.email ?? "—"}</td>
                <td className="p-3 text-xs text-muted-token font-mono max-w-xs truncate">{JSON.stringify(l.metadata)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function list() {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { email: true } } },
  });
}
