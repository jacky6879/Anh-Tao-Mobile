import { Phone, MessageCircle, MapPin, Facebook } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { env } from "@/lib/env";

export async function FloatingCTA() {
  const settings = await getSiteSettings();
  const zaloLink = `https://zalo.me/${settings.zalo}`;
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 md:hidden">
      <a
        href={`tel:${settings.hotline}`}
        aria-label="Gọi ngay"
        className="h-11 w-11 rounded-full bg-[var(--success)] text-white flex items-center justify-center shadow-lg"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="h-11 w-11 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-lg"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href={settings.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Messenger"
        className="h-11 w-11 rounded-full bg-[#0084ff] text-white flex items-center justify-center shadow-lg"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href={env.NEXT_PUBLIC_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Đường đi"
        className="h-11 w-11 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shadow-lg"
      >
        <MapPin className="h-5 w-5" />
      </a>
    </div>
  );
}
