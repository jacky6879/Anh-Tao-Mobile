import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { formatPriceRange } from "@/lib/format";
import { Markdown } from "@/lib/markdown";
import { JsonLd } from "@/components/SEO/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  let s;
  try { s = await prisma.repairService.findUnique({ where: { slug } }); } catch { return {}; }
  if (!s) return {};
  return { title: s.metaTitle ?? s.title, description: s.metaDescription ?? s.shortDescription ?? "", alternates: { canonical: `/sua-chua/${slug}` } };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  let service;
  try {
    service = await prisma.repairService.findUnique({ where: { slug, deletedAt: null } });
    if (service && service.status !== "published") service = null;
  } catch { /* DB */ }

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service",
        name: service.title, serviceType: service.serviceGroup,
        provider: { "@type": "LocalBusiness", name: env.NEXT_PUBLIC_BUSINESS_NAME },
        areaServed: "Thủ Dầu Một, Bình Dương",
        offers: { "@type": "Offer", priceCurrency: "VND", price: service.priceMin, priceSpecification: { "@type": "PriceRange", minPrice: service.priceMin, maxPrice: service.priceMax } },
      }} />

      <nav className="flex items-center gap-1 text-xs text-muted-token mb-4">
        <Link href="/" className="hover:text-primary-token">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/sua-chua" className="hover:text-primary-token">Sửa chữa</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary-token">{service.title}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
      {service.shortDescription && <p className="text-secondary-token mb-4">{service.shortDescription}</p>}

      <div className="surface-card p-4 mb-6 flex flex-wrap items-center gap-4">
        <div>
          <div className="text-xs text-muted-token">Mức giá</div>
          <div className="font-bold text-[var(--brand-primary)] text-lg">{formatPriceRange(service.priceMin, service.priceMax)}</div>
        </div>
        {service.estimatedTime && (
          <div className="flex items-center gap-1 text-sm"><Clock className="h-4 w-4" /> {service.estimatedTime}</div>
        )}
        {service.warranty && (
          <div className="flex items-center gap-1 text-sm"><ShieldCheck className="h-4 w-4" /> Bảo hành {service.warranty}</div>
        )}
        <Link href={`/dat-lich-sua-chua?service=${service.id}`} className="btn btn-primary ml-auto">Đặt lịch sửa chữa</Link>
      </div>

      {service.longDescription && (
        <div className="surface-card p-6">
          <Markdown>{service.longDescription}</Markdown>
        </div>
      )}

      <div className="mt-6 text-sm text-secondary-token">
        <p>📱 Liên hệ Zalo: <a className="text-[var(--brand-primary)]" href={`https://zalo.me/${env.NEXT_PUBLIC_ZALO}`}>{env.NEXT_PUBLIC_ZALO}</a> · ☎️ Hotline: <a className="text-[var(--brand-primary)]" href={`tel:${env.NEXT_PUBLIC_HOTLINE}`}>{env.NEXT_PUBLIC_HOTLINE}</a></p>
      </div>
    </div>
  );
}
