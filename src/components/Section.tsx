import Link from "next/link";

export function Section({
  title,
  description,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-secondary-token mt-1">{description}</p>}
        </div>
        {href && hrefLabel && (
          <Link href={href} className="text-sm font-medium text-[var(--brand-primary)] hover:underline whitespace-nowrap">
            {hrefLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
