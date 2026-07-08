import { prisma } from "@/lib/db";

export type LandingProduct = {
  id: string; slug: string; title: string; price: number;
  comparePrice: number | null; coverImage: string | null;
  condition: string | null; storage: string | null;
  warranty: string | null; installment: boolean;
};

export async function fetchLandingProducts(opts: {
  categorySlug?: string;
  brand?: string;
  condition?: string;
  take?: number;
}): Promise<LandingProduct[]> {
  try {
    return await prisma.product.findMany({
      where: {
        status: "published",
        deletedAt: null,
        ...(opts.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
        ...(opts.brand ? { brand: { contains: opts.brand, mode: "insensitive" } } : {}),
        ...(opts.condition ? { condition: opts.condition as never } : {}),
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: opts.take ?? 8,
      select: {
        id: true, slug: true, title: true, price: true, comparePrice: true,
        coverImage: true, condition: true, storage: true, warranty: true, installment: true,
      },
    });
  } catch {
    return [];
  }
}

export async function fetchLandingServices(opts: {
  serviceGroup?: string;
  take?: number;
}) {
  try {
    return await prisma.repairService.findMany({
      where: {
        status: "published",
        deletedAt: null,
        ...(opts.serviceGroup ? { serviceGroup: opts.serviceGroup } : {}),
      },
      orderBy: [{ featured: "desc" }, { priceMin: "asc" }],
      take: opts.take ?? 8,
      select: { id: true, slug: true, title: true, shortDescription: true, priceMin: true, priceMax: true, estimatedTime: true, serviceGroup: true },
    });
  } catch {
    return [];
  }
}
