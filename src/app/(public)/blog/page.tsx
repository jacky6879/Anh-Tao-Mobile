import Link from "next/link";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// DB-backed content; render per request (DB not available at build time on Vercel)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog - Tin tức và Thủ thuật",
  description: "Tổng hợp các bài viết mới nhất về công nghệ, đánh giá sản phẩm và mẹo hay.",
};

export default async function BlogIndexPage() {
  const posts = await prisma.seoPage.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tin tức & Thủ thuật</h1>
        <p className="mt-2 text-secondary-token">Cập nhật những thông tin mới nhất từ Anh Táo Mobile</p>
      </div>

      {posts.length === 0 ? (
        <div className="surface-card p-12 text-center text-secondary-token rounded-xl border border-token">
          Chưa có bài viết nào.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group surface-card rounded-xl border border-token overflow-hidden flex flex-col hover:border-[var(--brand-primary)] transition-colors">
              {post.ogImage ? (
                <div className="aspect-video overflow-hidden">
                  <img src={post.ogImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="aspect-video bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                  Không có ảnh
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[var(--brand-primary)]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-secondary-token line-clamp-3">
                  {post.metaDescription}
                </p>
                <div className="mt-auto pt-4 text-xs text-[var(--text-muted)]">
                  {format(new Date(post.createdAt), "dd MMMM yyyy", { locale: vi })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
