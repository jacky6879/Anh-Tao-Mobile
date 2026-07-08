import { prisma } from "@/lib/db";

/**
 * Vietnamese-aware slugify: strip diacritics, đ→d, lowercase, non-alnum → "-".
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Generate a unique slug within a Prisma model that has a `slug` unique field.
 * Suffixes -2, -3, ... on collision.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<unknown>,
): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  let i = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await exists(candidate)) {
    candidate = `${root}-${i}`;
    i += 1;
  }
  return candidate;
}

export const slugExistsProduct = (slug: string) =>
  prisma.product.findUnique({ where: { slug }, select: { id: true } });

export const slugExistsService = (slug: string) =>
  prisma.repairService.findUnique({ where: { slug }, select: { id: true } });

export const slugExistsCategory = (slug: string) =>
  prisma.category.findUnique({ where: { slug }, select: { id: true } });
