import Link from "next/link";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ProductActions } from "@/components/admin/RowActions";
import { deleteBlog } from "./actions";

export const metadata = { title: "Bài viết — Quản trị" };

export default async function AdminBlogsPage() {
  const blogs = await prisma.seoPage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý bài viết (Blog)</h1>
        <Link href="/admin/blogs/new" className="btn btn-primary">+ Viết bài mới</Link>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Đường dẫn (Slug)</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-token">Chưa có bài viết</td></tr>}
            {blogs.map((p) => (
              <tr key={p.id} className="border-t border-token">
                <td className="p-3 font-medium">
                  {p.title}
                </td>
                <td className="p-3">{p.slug}</td>
                <td className="p-3">{format(new Date(p.createdAt), "dd/MM/yyyy", { locale: vi })}</td>
                <td className="p-3">
                  <span className={`badge ${p.published ? 'badge-success' : 'badge-muted'}`}>
                    {p.published ? "Đã đăng" : "Bản nháp"}
                  </span>
                </td>
                <td className="p-3">
                  <ProductActions
                    editHref={`/admin/blogs/${p.id}`}
                    deleteAction={deleteBlog.bind(null, p.id)}
                    deleteLabel="Xoá bài"
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
