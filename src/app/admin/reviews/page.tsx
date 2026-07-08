import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { formatDateTime } from "@/lib/format";
import { ReviewActions } from "@/components/admin/ReviewActions";

export const metadata = { title: "Đánh giá — Quản trị" };

export default async function AdminReviewsPage() {
  let reviews: Awaited<ReturnType<typeof list>> = [];
  try { reviews = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đánh giá</h1>
      <div className="flex flex-col gap-3">
        {reviews.length === 0 && <p className="text-muted-token">Chưa có đánh giá.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="surface-card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{r.product.title} <span className="text-[var(--brand-accent)]">{"★".repeat(r.rating)}</span></p>
                <p className="text-sm text-secondary-token">bởi {r.user.email} {r.verifiedPurchase && <span className="badge badge-success">đã mua</span>}</p>
              </div>
              <span className="badge badge-muted">{r.status}</span>
            </div>
            {r.title && <p className="font-medium mt-2">{r.title}</p>}
            {r.body && <p className="text-sm text-secondary-token mt-1">{r.body}</p>}
            <p className="text-xs text-muted-token mt-1">{formatDateTime(r.createdAt)}</p>
            <div className="flex gap-2 mt-3">
              {r.status !== "published" && <ReviewActions label="Duyệt" action={approveReview.bind(null, r.id)} variant="primary" />}
              {r.status !== "hidden" && <ReviewActions label="Ẩn" action={hideReview.bind(null, r.id)} variant="ghost" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function list() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { product: { select: { title: true } }, user: { select: { email: true } } },
  });
}

export async function approveReview(id: string) {
  "use server";
  const session = await requireAdmin();
  const r = await prisma.review.update({ where: { id }, data: { status: "published" }, select: { productId: true } });
  const agg = await prisma.review.aggregate({ where: { productId: r.productId, status: "published" }, _avg: { rating: true }, _count: { rating: true } });
  await prisma.product.update({ where: { id: r.productId }, data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "confirm", entityType: "Review", entityId: id, metadata: {} } });
  revalidatePath("/admin/reviews");
}

export async function hideReview(id: string) {
  "use server";
  const session = await requireAdmin();
  await prisma.review.update({ where: { id }, data: { status: "hidden" } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "reject", entityType: "Review", entityId: id, metadata: {} } });
  revalidatePath("/admin/reviews");
}
