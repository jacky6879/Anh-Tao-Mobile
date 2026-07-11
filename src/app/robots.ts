import type { MetadataRoute } from "next";

const SITE_URL = "https://anhtaomobile.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/checkout", "/gio-hang", "/order"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
