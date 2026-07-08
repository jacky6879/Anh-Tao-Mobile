import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { env } from "@/lib/env";
import { LeadForm } from "@/components/LeadForm";

export const metadata = { title: "Liên hệ Anh Táo Mobile", description: "Liên hệ Anh Táo Mobile — hotline, Zalo, địa chỉ tại Bình Dương.", alternates: { canonical: "/lien-he" } };

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Liên hệ</h1>
      <p className="text-secondary-token text-sm mb-6">Anh Táo Mobile — Bình Dương. Tư vấn thật, không nói quá.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="surface-card p-5 flex flex-col gap-3">
          <a href={`tel:${env.NEXT_PUBLIC_HOTLINE}`} className="flex items-center gap-3 hover:text-[var(--brand-primary)]">
            <Phone className="h-5 w-5" /> <span>Hotline: <b>{env.NEXT_PUBLIC_HOTLINE}</b></span>
          </a>
          <a href={`https://zalo.me/${env.NEXT_PUBLIC_ZALO}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--brand-primary)]">
            <MessageCircle className="h-5 w-5" /> <span>Zalo: {env.NEXT_PUBLIC_ZALO}</span>
          </a>
          <a href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="flex items-center gap-3 hover:text-[var(--brand-primary)]">
            <Mail className="h-5 w-5" /> <span>{env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
          </a>
          <a href={env.NEXT_PUBLIC_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--brand-primary)]">
            <MapPin className="h-5 w-5" /> <span>{env.NEXT_PUBLIC_BUSINESS_ADDRESS}</span>
          </a>
          {env.NEXT_PUBLIC_BUSINESS_TAX_ID && <p className="text-xs text-muted-token pt-2 border-t border-token">Mã số thuế: {env.NEXT_PUBLIC_BUSINESS_TAX_ID}</p>}
        </div>

        <div className="surface-card p-5">
          <h2 className="font-semibold mb-3">Gửi tin nhắn cho shop</h2>
          <LeadForm type="consult" />
        </div>
      </div>
    </div>
  );
}
