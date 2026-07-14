import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = "https://anhtaomobile.com";

const STATIC = [
  "", "san-pham", "sua-chua", "thu-cu-doi-moi", "tra-gop", "bao-hanh",
  "lien-he", "dat-lich-sua-chua", "gui-may-thu-cu", "thay-pin-iphone",
  "thay-man-hinh-iphone", "ep-kinh-iphone", "iphone-cu", "iphone-moi",
  "ipad", "macbook", "privacy", "terms", "refund-policy", "warranty-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const staticEntries: MetadataRoute.Sitemap = STATIC.map((p) => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  let serviceEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const [products, services, categories, posts] = await Promise.all([
      prisma.product.findMany({ where: { status: "published", deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.repairService.findMany({ where: { status: "published", deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ where: { deletedAt: null }, select: { slug: true } }),
      prisma.seoPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
    productEntries = products.map((p) => ({
      url: `${base}/san-pham/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    serviceEntries = services.map((s) => ({
      url: `${base}/sua-chua/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    categoryEntries = categories.map((c) => ({
      url: `${base}/danh-muc/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    blogEntries = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // DB unavailable.
  }

  return [...staticEntries, ...productEntries, ...serviceEntries, ...categoryEntries, ...blogEntries];
}
