import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "img-src 'self' https://*.supabase.co data: blob:",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "frame-src https://www.youtube-nocookie.com https://drive.google.com https://www.google.com",
  "connect-src 'self' https://*.supabase.co https://*.ingest.sentry.io",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp.join("; ") },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.anhtaomobile.com" }],
        destination: "https://anhtaomobile.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const sentryConfig = {
  org: process.env.SENTRY_ORG || "",
  project: process.env.SENTRY_PROJECT || "",
  silent: !process.env.SENTRY_ORG,
  hideSourceMaps: true,
  disableServerWebpackPlugin: !process.env.SENTRY_ORG,
  disableClientWebpackPlugin: !process.env.SENTRY_ORG,
  tunnelRoute: "/monitoring",
};

export default withSentryConfig(nextConfig, sentryConfig);
