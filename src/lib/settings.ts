import { prisma } from "./db";
import { env } from "./env";
import { unstable_cache } from "next/cache";

// Cache settings for 1 minute (or revalidated on demand)
export const getSiteSettings = unstable_cache(
  async () => {
    const records = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const r of records) {
      if (r.value) map[r.key] = r.value;
    }
    
    // Provide default fallbacks from env if not set in DB
    return {
      hotline: map.hotline || env.NEXT_PUBLIC_HOTLINE || "0819000011",
      zalo: map.zalo || env.NEXT_PUBLIC_ZALO || "0819000011",
      messenger: map.messenger || env.NEXT_PUBLIC_MESSENGER || "https://m.me/anhtaobinhduongg",
      address: map.address || env.NEXT_PUBLIC_BUSINESS_ADDRESS || "1013 Cách Mạng Tháng 8, P. Phú Cường, TP. Thủ Dầu Một, Bình Dương",
      heroTitle: map.heroTitle || "Anh Táo Mobile - Uy Tín Tạo Niềm Tin",
      heroSubtitle: map.heroSubtitle || "Chuyên mua bán, sửa chữa các dòng iPhone, iPad, MacBook chính hãng với giá tốt nhất Bình Dương.",
    };
  },
  ["site-settings"],
  { tags: ["site-settings"], revalidate: 60 }
);
