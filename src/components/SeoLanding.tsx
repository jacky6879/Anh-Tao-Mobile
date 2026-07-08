import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/SEO/JsonLd";
import { env } from "@/lib/env";

export type Faq = { q: string; a: string };

export function SeoLanding({
  title,
  h1,
  description,
  crumbs,
  body,
  faqs,
  ctaHref = "/san-pham",
  ctaLabel = "Xem máy đang bán",
  children,
}: {
  title: string;
  h1: string;
  description: string;
  crumbs: { href: string; label: string }[];
  body: React.ReactNode;
  faqs?: Faq[];
  ctaHref?: string;
  ctaLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${env.NEXT_PUBLIC_SITE_URL}${c.href}`,
          })),
        }}
      />
      {faqs && faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-8">
        <nav className="flex items-center gap-1 text-xs text-muted-token mb-4 flex-wrap">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1">
              <Link href={c.href} className="hover:text-primary-token">{c.label}</Link>
              {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
            </span>
          ))}
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">{h1}</h1>
        <p className="text-lg text-secondary-token mb-6">{description}</p>

        <div className="prose prose-sm dark:prose-invert max-w-none mb-8">{body}</div>

        {children}

        {faqs && faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <div className="divide-y divide-[var(--border-default)]">
              {faqs.map((f) => (
                <details key={f.q} className="py-3">
                  <summary className="cursor-pointer font-medium list-none">{f.q}</summary>
                  <p className="mt-2 text-sm text-secondary-token">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 surface-card p-6 text-center">
          <p className="font-semibold mb-3">{title}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={ctaHref} className="btn btn-primary">{ctaLabel}</Link>
            <a href={`tel:${env.NEXT_PUBLIC_HOTLINE}`} className="btn btn-secondary">Gọi {env.NEXT_PUBLIC_HOTLINE}</a>
          </div>
        </div>
      </div>
    </>
  );
}
