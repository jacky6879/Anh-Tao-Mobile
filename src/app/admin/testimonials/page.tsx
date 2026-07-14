import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductActions } from "@/components/admin/RowActions";
import { deleteTestimonial } from "./actions";

export const metadata = { title: "Đánh giá khách hàng — Quản trị" };

const STATUS_LABEL: Record<string, string> = {
  published: "Hiển thị",
  pending: "Chờ duyệt",
  hidden: "Ẩn",
};

export default async function AdminTestimonialsPage() {
  let items: Awaited<ReturnType<typeof list>> = [];
  try { items = await list(); } catch { /* DB */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Đánh giá khách hàng</h1>
        <Link href="/admin/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>
      <p className="text-sm text-secondary-token mb-4">
        Quản lý ảnh + nhận xét khách hàng hiển thị ở mục &ldquo;Khách hàng nói gì&rdquo; trên trang chủ.
        Chỉ mục ở trạng thái &ldquo;Hiển thị&rdquo; mới xuất hiện trên web.
      </p>

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="surface-subtle text-left text-muted-token">
            <tr>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Nội dung</th>
              <th className="p-3">Sao</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thứ tự</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-muted-token">Chưa có đánh giá nào</td></tr>
            )}
            {items.map((t) => (
              <tr key={t.id} className="border-t border-token align-top">
                <td className="p-3">
                  {t.photoImage || t.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photoImage || t.avatarImage || ""} alt={t.customerName} className="w-14 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg surface-subtle flex items-center justify-center text-muted-token text-xs">—</div>
                  )}
                </td>
                <td className="p-3 font-medium">
                  {t.customerName}
                  {t.productName && <div className="text-xs text-muted-token font-normal">{t.productName}</div>}
                  {t.featured && <span className="badge badge-success mt-1 inline-block">nổi bật</span>}
                </td>
                <td className="p-3 max-w-xs text-secondary-token">{t.comment}</td>
                <td className="p-3 text-[var(--brand-accent)] whitespace-nowrap">{"★".repeat(t.rating)}</td>
                <td className="p-3"><span className="badge badge-muted whitespace-nowrap">{STATUS_LABEL[t.status] ?? t.status}</span></td>
                <td className="p-3">{t.order}</td>
                <td className="p-3">
                  <ProductActions
                    editHref={`/admin/testimonials/${t.id}`}
                    deleteAction={deleteTestimonial.bind(null, t.id)}
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
  return prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 200,
  });
}
