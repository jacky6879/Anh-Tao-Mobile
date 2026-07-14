import Link from "next/link";
import { Wrench, RefreshCw, BadgeCheck, MessageSquareQuote, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/db";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/SEO/JsonLd";
import { formatPriceRange } from "@/lib/format";
import { env } from "@/lib/env";

// DB-backed content; render per request (DB not available at build time on Vercel)
export const dynamic = "force-dynamic";

const repairIcons: Record<string, string> = {
  "Thay pin": "🔋", "Thay màn hình": "📱", "Ép kính": "🪟", "Chân sạc": "🔌",
  Camera: "📷", "Loa / Mic": "🔊", "Face ID": "🙂", Mainboard: "🧩",
  "Phần mềm": "💾", "Vệ sinh máy": "🧹",
};

const faqs = [
  { q: "Máy cũ có bảo hành không?", a: "Có. Mỗi máy đều có thông tin bảo hành rõ ràng (3–12 tháng tuỳ máy) ghi ngay trên trang sản phẩm." },
  { q: "Có hỗ trợ trả góp không?", a: "Có với một số máy được bật tuỳ chọn trả góp. Liên hệ shop để được tư vấn ngân hàng." },
  { q: "Có thu cũ đổi mới không?", a: "Có. Bạn gửi thông tin máy cũ qua form thu cũ, shop báo giá rồi trừ vào máy mới." },
  { q: "Thay pin mất bao lâu?", a: "Thay pin lấy liền khoảng 30–45 phút tuỳ dòng máy." },
  { q: "Sửa máy có cần đặt lịch không?", a: "Nên đặt lịch để được phục vụ nhanh. Bạn cũng có thể ghé trực tiếp shop." },
];

const FALLBACK_TESTIMONIALS = [
  { id: "f1", customerName: "Minh T.", productName: null as string | null, comment: "Mua iPhone 14 Pro Max cũ, máy đẹp y như mới, pin 100%. Bảo hành rõ ràng.", rating: 5, avatarImage: null as string | null, photoImage: null as string | null },
  { id: "f2", customerName: "Hoa N.", productName: null as string | null, comment: "Thay pin iPhone 12 trong 40 phút, sạc lại trâu. Anh chủ tư vấn nhiệt tình.", rating: 5, avatarImage: null as string | null, photoImage: null as string | null },
  { id: "f3", customerName: "Quân L.", productName: null as string | null, comment: "Thu iPhone 11 lên đời 13, giá thu cũ hợp lý, làm thủ tục nhanh.", rating: 5, avatarImage: null as string | null, photoImage: null as string | null },
];

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  try {
    [products, services, testimonials] = await Promise.all([getProducts(), getServices(), getTestimonials()]);
  } catch {
    // DB not ready — render page without dynamic data.
  }
  const reviews = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <>
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
      <Hero />

      <Section
        title="Máy nổi bật"
        description="iPhone, iPad, MacBook cũ/mới đã kiểm định kỹ."
        href="/san-pham"
        hrefLabel="Xem tất cả"
      >
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
          <p className="text-secondary-token">Chưa có sản phẩm. Vào admin để thêm.</p>
        )}
      </Section>

      <Section
        title="Dịch vụ sửa chữa"
        description="Thay pin, thay màn hình, ép kính, thay chân sạc — lấy liền."
        href="/sua-chua"
        hrefLabel="Xem tất cả"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length > 0 ? (
            services.map((s) => (
              <Link key={s.id} href={`/sua-chua/${s.slug}`} className="surface-card p-4 hover:shadow-lg transition flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{repairIcons[s.serviceGroup] ?? "🛠️"}</span>
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                {s.shortDescription && <p className="text-sm text-secondary-token">{s.shortDescription}</p>}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-bold text-[var(--brand-primary)]">{formatPriceRange(s.priceMin, s.priceMax)}</span>
                  {s.estimatedTime && <span className="text-xs text-muted-token">⏱ {s.estimatedTime}</span>}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-secondary-token">Chưa có dịch vụ.</p>
          )}
        </div>
      </Section>

      <section className="surface-subtle">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-[var(--brand-primary)] font-semibold mb-2">
              <RefreshCw className="h-5 w-5" /> Thu cũ đổi mới
            </div>
            <h2 className="text-2xl font-bold mb-2">Lên đời iPhone mới, Anh Táo hỗ trợ thu máy cũ giá tốt</h2>
            <p className="text-secondary-token mb-4">
              Gửi thông tin máy đang dùng, shop báo giá thu cũ rồi trừ vào máy mới. Nhanh, rõ ràng, không ép giá.
            </p>
            <Link href="/gui-may-thu-cu" className="btn btn-primary">Gửi máy thu cũ</Link>
          </div>
          <div className="surface-card p-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Why icon={BadgeCheck} text="Tư vấn đúng nhu cầu" />
              <Why icon={BadgeCheck} text="Có hình máy thực tế" />
              <Why icon={BadgeCheck} text="Báo giá rõ ràng" />
              <Why icon={BadgeCheck} text="Không tự ý sửa khi chưa đồng ý" />
              <Why icon={BadgeCheck} text="Hỗ trợ sau bán" />
              <Why icon={BadgeCheck} text="Kiểm tra máy miễn phí" />
            </div>
          </div>
        </div>
      </section>

      <Section title="Khách hàng nói gì" description="Hình ảnh & đánh giá thật từ khách đã mua máy, sửa chữa tại Anh Táo.">
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="surface-card p-4 flex flex-col gap-3">
              {r.photoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.photoImage}
                  alt={`Khách hàng ${r.customerName}${r.productName ? ` - ${r.productName}` : ""}`}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <MessageSquareQuote className="h-5 w-5 text-[var(--brand-accent)]" />
              )}
              <p className="text-sm text-secondary-token flex-1">“{r.comment}”</p>
              <div className="flex items-center gap-3 pt-1">
                {r.avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.avatarImage}
                    alt={r.customerName}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-semibold">
                    {r.customerName.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{r.customerName}</span>
                  <span className="text-xs text-[var(--brand-accent)]">
                    {"★".repeat(Math.max(1, Math.min(5, r.rating)))}
                    {r.productName ? ` · ${r.productName}` : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Câu hỏi thường gặp">
        <div className="max-w-3xl divide-y divide-[var(--border-default)]">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="flex items-center justify-between cursor-pointer font-medium list-none">
                {f.q}
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-secondary-token">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="bg-[var(--brand-primary)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Cần tư vấn máy hay sửa chữa?</h2>
            <p className="opacity-90">Gọi ngay hoặc chat Zalo — Anh Táo tư vấn thật, không nói quá.</p>
          </div>
          <div className="flex gap-3">
            <a href={`tel:${env.NEXT_PUBLIC_HOTLINE}`} className="btn bg-white text-[var(--brand-primary)]">Gọi ngay</a>
            <Link href="/dat-lich-sua-chua" className="btn btn-secondary">
              <Wrench className="h-4 w-4" /> Đặt lịch sửa chữa
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Why({ icon: Icon, text }: { icon: typeof BadgeCheck; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--brand-primary)]" /> {text}
    </div>
  );
}

type ProductList = {
  id: string; slug: string; title: string; price: number;
  comparePrice: number | null; coverImage: string | null;
  condition: string | null; storage: string | null;
  warranty: string | null; installment: boolean;
};
type ServiceList = {
  id: string; slug: string; title: string; shortDescription: string | null;
  serviceGroup: string; priceMin: number; priceMax: number; estimatedTime: string | null;
};

async function getProducts(): Promise<ProductList[]> {
  return prisma.product.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 8,
    select: {
      id: true, slug: true, title: true, price: true, comparePrice: true,
      coverImage: true, condition: true, storage: true, warranty: true, installment: true,
    },
  });
}

async function getServices(): Promise<ServiceList[]> {
  return prisma.repairService.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    select: {
      id: true, slug: true, title: true, shortDescription: true,
      serviceGroup: true, priceMin: true, priceMax: true, estimatedTime: true,
    },
  });
}

type TestimonialList = {
  id: string; customerName: string; productName: string | null;
  comment: string; rating: number; avatarImage: string | null; photoImage: string | null;
};

async function getTestimonials(): Promise<TestimonialList[]> {
  return prisma.testimonial.findMany({
    where: { status: "published" },
    orderBy: [{ order: "asc" }, { featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    select: {
      id: true, customerName: true, productName: true,
      comment: true, rating: true, avatarImage: true, photoImage: true,
    },
  });
}
