import Link from "next/link";
import { prisma } from "@/lib/db";

export async function CategoryNav() {
  let categories: { slug: string; name: string; icon: string | null }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { deletedAt: null, parentId: null },
      orderBy: { order: "asc" },
      select: { slug: true, name: true, icon: true },
    });
  } catch {
    // DB not ready yet — render nothing.
  }

  if (categories.length === 0) return null;

  return (
    <div className="border-t border-token bg-[var(--bg-subtle)]">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex gap-1 overflow-x-auto py-2 text-sm">
          <Link href="/san-pham" className="px-3 py-1 rounded-md whitespace-nowrap hover:bg-[var(--bg-elevated)]">
            Tất cả
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/danh-muc/${c.slug}`}
              className="px-3 py-1 rounded-md whitespace-nowrap hover:bg-[var(--bg-elevated)]"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
