import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/format";
import { ProductActions } from "@/components/admin/RowActions";
import { deleteProduct } from "./actions";

export const metadata = { title: "Sản phẩm — Quản trị" };

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof list>> = [];
  try { products = await list(); } catch { /* DB */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <Link href="/admin/products/new" className="btn btn-primary">+ Thêm sản phẩm</Link>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr>
              <th className="p-3">Tên</th><th className="p-3">Giá</th><th className="p-3">Kho</th><th className="p-3">Trạng thái</th><th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-token">Chưa có sản phẩm</td></tr>}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-token">
                <td className="p-3">
                  <Link href={`/san-pham/${p.slug}`} className="font-medium hover:text-[var(--brand-primary)]">{p.title}</Link>
                  {p.featured && <span className="badge badge-info ml-2">Nổi bật</span>}
                </td>
                <td className="p-3">{formatVND(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3"><span className="badge badge-muted">{p.status}</span></td>
                <td className="p-3">
                  <ProductActions
                    editHref={`/admin/products/${p.id}`}
                    deleteAction={deleteProduct.bind(null, p.id)}
                    deleteLabel="Xoá"
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
  return prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, price: true, stock: true, status: true, featured: true },
  });
}

