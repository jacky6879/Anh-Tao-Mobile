import Link from "next/link";
import { Phone, Wrench, MessageCircle, ShieldCheck, BadgeCheck, RefreshCw, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

const badges = [
  { icon: BadgeCheck, label: "Máy được kiểm tra kỹ" },
  { icon: ShieldCheck, label: "Bảo hành rõ ràng" },
  { icon: RefreshCw, label: "Hỗ trợ thu cũ đổi mới" },
  { icon: Clock, label: "Sửa chữa lấy liền" },
];

export async function Hero() {
  const settings = await getSiteSettings();
  return (
    <section className="mesh-gradient">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="badge badge-success mb-4">
            <span className="pulse-dot" /> Đang hoạt động tại Bình Dương
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {settings.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-secondary-token whitespace-pre-wrap">
            {settings.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/san-pham" className="btn btn-primary">Xem máy đang bán</Link>
            <Link href="/dat-lich-sua-chua" className="btn btn-secondary">
              <Wrench className="h-4 w-4" /> Đặt lịch sửa chữa
            </Link>
            <a
              href={`https://zalo.me/${settings.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <MessageCircle className="h-4 w-4" /> Chat Zalo ngay
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-xl">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-secondary-token">
                <b.icon className="h-4 w-4 text-[var(--brand-primary)]" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[var(--brand-primary)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-2 text-sm flex items-center gap-2 justify-center">
          <Phone className="h-4 w-4" />
          Hotline: <a href={`tel:${settings.hotline}`} className="font-bold underline">{settings.hotline}</a>
        </div>
      </div>
    </section>
  );
}
