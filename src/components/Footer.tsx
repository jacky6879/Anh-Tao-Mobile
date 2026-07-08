import Link from "next/link";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { env } from "@/lib/env";

const legal = [
  { href: "/privacy", label: "Chính sách bảo mật" },
  { href: "/terms", label: "Điều khoản" },
  { href: "/refund-policy", label: "Chính sách đổi trả" },
  { href: "/warranty-policy", label: "Chính sách bảo hành" },
  { href: "/lien-he", label: "Liên hệ" },
];

const explore = [
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/sua-chua", label: "Sửa chữa" },
  { href: "/thu-cu-doi-moi", label: "Thu cũ đổi mới" },
  { href: "/tra-gop", label: "Trả góp" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  return (
    <footer className="surface-subtle border-t border-token mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-primary)] text-white">
              AT
            </span>
            {env.NEXT_PUBLIC_SITE_NAME}
          </div>
          <p className="text-sm text-secondary-token">
            iPhone, iPad, MacBook cũ/mới và sửa chữa thay linh kiện lấy liền tại Bình Dương.
            Uy tín tạo niềm tin.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-token">Khám phá</h3>
          <ul className="space-y-2 text-sm">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-secondary-token hover:text-primary-token">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-token">Pháp lý</h3>
          <ul className="space-y-2 text-sm">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-secondary-token hover:text-primary-token">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-token">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-secondary-token">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${settings.hotline}`} className="hover:text-primary-token">{settings.hotline}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <a href={`https://zalo.me/${settings.zalo}`} className="hover:text-primary-token">Zalo: {settings.zalo}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="hover:text-primary-token">{env.NEXT_PUBLIC_CONTACT_EMAIL}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <a href={env.NEXT_PUBLIC_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary-token">
                {settings.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-token">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-token flex flex-col sm:flex-row gap-2 justify-between">
          <span>
            © {new Date().getFullYear()} {env.NEXT_PUBLIC_BUSINESS_NAME}
            {env.NEXT_PUBLIC_BUSINESS_TAX_ID ? ` · MST: ${env.NEXT_PUBLIC_BUSINESS_TAX_ID}` : ""}
          </span>
          <span>Uy tín tạo niềm tin</span>
        </div>
      </div>
    </footer>
  );
}
