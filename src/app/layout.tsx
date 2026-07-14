import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

import { env } from "@/lib/env";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FlashToast } from "@/components/FlashToast";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ReferralCapture } from "@/components/ReferralCapture";
import { JsonLd } from "@/components/SEO/JsonLd";
import { AnalyticsScript } from "@/components/SEO/AnalyticsScript";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${env.NEXT_PUBLIC_SITE_NAME} — iPhone cũ, máy đẹp, bảo hành rõ ràng`,
    template: `%s — ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description:
    "Chuyên iPhone, iPad, MacBook, smartphone cũ/mới và sửa chữa thay linh kiện lấy liền tại Bình Dương.",
  keywords: [
    "iPhone cũ Bình Dương",
    "iPhone 14 Pro Max cũ",
    "thay pin iPhone",
    "thay màn hình iPhone",
    "sửa điện thoại lấy liền",
    env.NEXT_PUBLIC_SITE_NAME,
  ],
  openGraph: {
    type: "website",
    siteName: env.NEXT_PUBLIC_SITE_NAME,
    url: env.NEXT_PUBLIC_SITE_URL,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  verification: {
    google: env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
(function(){try{
  var t = localStorage.getItem('theme');
  var d = t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches);
  if (d) document.documentElement.classList.add('dark');
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <Script id="theme-script">{themeScript}</Script>
      </head>
      <body className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 btn btn-primary"
        >
          Bỏ qua tới nội dung
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${env.NEXT_PUBLIC_SITE_URL}/#business`,
            name: env.NEXT_PUBLIC_BUSINESS_NAME,
            url: env.NEXT_PUBLIC_SITE_URL,
            email: env.NEXT_PUBLIC_CONTACT_EMAIL,
            telephone: env.NEXT_PUBLIC_HOTLINE,
            image: `${env.NEXT_PUBLIC_SITE_URL}/opengraph-image`,
            priceRange: "1.000.000₫ - 30.000.000₫",
            description: "Chuyên iPhone, iPad, MacBook cũ/mới và sửa chữa thay linh kiện lấy liền tại Bình Dương. BH pin 60 tháng, main 12 tháng 1 đổi 1.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1013 Cách Mạng Tháng 8",
              addressLocality: "Phường Thủ Dầu Một",
              addressRegion: "Hồ Chí Minh",
              addressCountry: "VN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 10.9804,
              longitude: 106.6519,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "09:00",
                closes: "21:00",
              },
            ],
            sameAs: [
              "https://www.facebook.com/anhtaobinhduongg",
              "https://www.tiktok.com/@anhtaoiphonebd",
              "https://zalo.me/0819000011",
            ],
          }}
        />
        <div className="min-h-screen flex flex-col surface-page">
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <FloatingCTA />
        <FlashToast />
        <ReferralCapture />
        <AnalyticsScript />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
