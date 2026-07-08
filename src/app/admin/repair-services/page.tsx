import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/format";
import { ProductActions } from "@/components/admin/RowActions";
import { deleteService } from "./actions";

export const metadata = { title: "Dịch vụ sửa chữa — Quản trị" };

export default async function AdminServicesPage() {
  let services: Awaited<ReturnType<typeof list>> = [];
  try { services = await list(); } catch { /* DB */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dịch vụ sửa chữa</h1>
        <Link href="/admin/repair-services/new" className="btn btn-primary">+ Thêm dịch vụ</Link>
      </div>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr><th className="p-3">Tên</th><th className="p-3">Nhóm</th><th className="p-3">Giá</th><th className="p-3">Trạng thái</th><th className="p-3">Thao tác</th></tr>
          </thead>
          <tbody>
            {services.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-token">Chưa có dịch vụ</td></tr>}
            {services.map((s) => (
              <tr key={s.id} className="border-t border-token">
                <td className="p-3"><Link href={`/sua-chua/${s.slug}`} className="font-medium hover:text-[var(--brand-primary)]">{s.title}</Link></td>
                <td className="p-3">{s.serviceGroup}</td>
                <td className="p-3">{formatPriceRange(s.priceMin, s.priceMax)}</td>
                <td className="p-3"><span className="badge badge-muted">{s.status}</span></td>
                <td className="p-3"><ProductActions editHref={`/admin/repair-services/${s.id}`} deleteAction={deleteService.bind(null, s.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function list() {
  return prisma.repairService.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, serviceGroup: true, priceMin: true, priceMax: true, status: true },
  });
}
