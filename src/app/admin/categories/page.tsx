import { prisma } from "@/lib/db";
import { ProductActions } from "@/components/admin/RowActions";
import { createCategory, deleteCategory } from "./actions";

export const metadata = { title: "Danh mục — Quản trị" };

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof list>> = [];
  try { categories = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh mục</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="surface-subtle text-left text-muted-token">
              <tr><th className="p-3">Tên</th><th className="p-3">Slug</th><th className="p-3">Thứ tự</th><th className="p-3">Thao tác</th></tr>
            </thead>
            <tbody>
              {categories.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-muted-token">Chưa có danh mục</td></tr>}
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-token">
                  <td className="p-3">{c.icon} {c.name}</td>
                  <td className="p-3 font-mono text-xs">{c.slug}</td>
                  <td className="p-3">{c.order}</td>
                  <td className="p-3"><ProductActions editHref={`/admin/categories?edit=${c.id}`} deleteAction={deleteCategory.bind(null, c.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={createCategory} className="surface-card p-4 flex flex-col gap-3 h-fit">
          <h2 className="font-semibold">Thêm danh mục</h2>
          <input name="name" placeholder="Tên danh mục" required className="input-token" />
          <input name="slug" placeholder="Slug (để trống tự sinh)" className="input-token" />
          <input name="icon" placeholder="Icon (emoji)" className="input-token" />
          <input name="order" type="number" defaultValue={0} className="input-token" />
          <textarea name="description" rows={2} placeholder="Mô tả" className="input-token" />
          <button className="btn btn-primary">Thêm</button>
        </form>
      </div>
    </div>
  );
}

async function list() {
  return prisma.category.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" }, select: { id: true, name: true, slug: true, icon: true, order: true } });
}
