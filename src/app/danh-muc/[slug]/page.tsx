import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";

// ISR: cache rendered category pages, revalidate every 5 minutes
export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  let cat;
  try { cat = await prisma.category.findUnique({ where: { slug } }); } catch { return {}; }
  if (!cat) return {};
  return { title: cat.name, description: cat.description ?? undefined, alternates: { canonical: `/danh-muc/${slug}` } };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  let category;
  let products: Awaited<ReturnType<typeof list>> = [];
  try {
    category = await prisma.category.findUnique({ where: { slug, deletedAt: null } });
    if (category) products = await list(category.id);
  } catch { /* DB */ }

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{category.name}</h1>
      {category.description && <p className="text-secondary-token text-sm mb-6">{category.description}</p>}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} slug={p.slug} title={p.title} price={p.price} comparePrice={p.comparePrice}
              coverImage={p.coverImage} condition={p.condition} storage={p.storage} warranty={p.warranty} installment={p.installment} />
          ))}
        </div>
      ) : (
        <EmptyState title="Chưa có sản phẩm trong danh mục này" />
      )}
    </div>
  );
}

async function list(categoryId: string) {
  return prisma.product.findMany({
    where: { status: "published", deletedAt: null, categoryId },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, title: true, price: true, comparePrice: true, coverImage: true, condition: true, storage: true, warranty: true, installment: true },
  });
}
