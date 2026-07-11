import Link from "next/link";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { CONDITION_LABELS } from "@/lib/format";

const CONDITIONS = ["new_seal", "like_new", "percent99", "used", "light_scratch"];

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = sp.page ? `?page=${sp.page}` : "";
  return {
    title: "Sản phẩm — iPhone, iPad, MacBook, smartphone",
    description: "Danh sách điện thoại, iPad, MacBook cũ/mới tại Anh Táo Mobile. Máy đẹp, kiểm tra kỹ, bảo hành rõ ràng.",
    alternates: { canonical: `/san-pham${page}` },
  };
}

type Search = {
  q?: string; category?: string; brand?: string; condition?: string;
  min?: string; max?: string; sort?: string; page?: string;
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = 24;

  const where: Prisma.ProductWhereInput = {
    status: "published",
    deletedAt: null,
    ...(sp.q ? { title: { contains: sp.q, mode: "insensitive" } } : {}),
    ...(sp.category ? { category: { slug: sp.category } } : {}),
    ...(sp.brand ? { brand: sp.brand } : {}),
    ...(sp.condition ? { condition: sp.condition as Prisma.ProductWhereInput["condition"] } : {}),
    ...(sp.min || sp.max
      ? { price: { gte: sp.min ? Number(sp.min) : undefined, lte: sp.max ? Number(sp.max) : undefined } }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
    sp.sort === "price_asc" ? { price: "asc" }
    : sp.sort === "price_desc" ? { price: "desc" }
    : sp.sort === "newest" ? { createdAt: "desc" }
    : [{ featured: "desc" }, { createdAt: "desc" }];

  let products: Awaited<ReturnType<typeof list>> = [];
  let total = 0;
  let categories: { slug: string; name: string }[] = [];
  let brands: string[] = [];
  try {
    [products, total, categories, brands] = await Promise.all([
      list(where, orderBy, page, pageSize),
      prisma.product.count({ where }),
      prisma.category.findMany({ where: { deletedAt: null }, select: { slug: true, name: true }, orderBy: { order: "asc" } }),
      prisma.product.findMany({ where: { status: "published", deletedAt: null, brand: { not: null } }, distinct: ["brand"], select: { brand: true } })
        .then((r) => r.map((x) => x.brand).filter(Boolean) as string[]),
    ]);
  } catch {
    /* DB not ready */
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Sản phẩm</h1>
      <p className="text-secondary-token text-sm mb-6">iPhone, iPad, MacBook, smartphone cũ/mới — kiểm tra kỹ, bảo hành rõ ràng.</p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="surface-card p-4 h-fit lg:sticky lg:top-20">
          <form className="flex flex-col gap-4" method="get">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-token">Tìm kiếm</label>
              <input name="q" defaultValue={sp.q} placeholder="VD: iPhone 14" className="input-token mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-token">Danh mục</label>
              <select name="category" defaultValue={sp.category} className="input-token mt-1">
                <option value="">Tất cả</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-token">Hãng</label>
              <select name="brand" defaultValue={sp.brand} className="input-token mt-1">
                <option value="">Tất cả</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-token">Tình trạng</label>
              <select name="condition" defaultValue={sp.condition} className="input-token mt-1">
                <option value="">Tất cả</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <input name="min" type="number" defaultValue={sp.min} placeholder="Giá từ" className="input-token" />
              <input name="max" type="number" defaultValue={sp.max} placeholder="Đến" className="input-token" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-token">Sắp xếp</label>
              <select name="sort" defaultValue={sp.sort} className="input-token mt-1">
                <option value="">Nổi bật</option>
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Lọc</button>
            <Link href="/san-pham" className="btn btn-ghost text-sm">Xoá lọc</Link>
          </form>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-token">{total} sản phẩm</span>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  price={p.price}
                  comparePrice={p.comparePrice}
                  coverImage={p.coverImage}
                  condition={p.condition}
                  storage={p.storage}
                  warranty={p.warranty}
                  installment={p.installment}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="Chưa có sản phẩm" description="Thử bỏ bớt bộ lọc hoặc quay lại sau." />
          )}

          {totalPages > 1 && (
            <nav className="flex justify-center gap-1 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={`/san-pham?${new URLSearchParams({ ...sp, page: String(n) }).toString()}`}
                  className={`px-3 py-1 rounded-md text-sm ${n === page ? "bg-[var(--brand-primary)] text-white" : "surface-card"}`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

type ListItem = {
  id: string; slug: string; title: string; price: number;
  comparePrice: number | null; coverImage: string | null;
  condition: string | null; storage: string | null;
  warranty: string | null; installment: boolean;
};

async function list(
  where: Prisma.ProductWhereInput,
  orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[],
  page: number,
  pageSize: number,
): Promise<ListItem[]> {
  return prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true, slug: true, title: true, price: true, comparePrice: true,
      coverImage: true, condition: true, storage: true, warranty: true, installment: true,
    },
  });
}
