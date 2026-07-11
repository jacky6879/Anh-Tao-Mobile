import { z } from "zod";

const boolString = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1");

const optionalUrl = z.string().url().or(z.literal("")).optional().default("");

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional().default(""),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.literal("")).default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),

  // Auth
  AUTH_SECRET: z.string().min(8, "AUTH_SECRET must be set (use: openssl rand -base64 32)"),
  AUTH_GOOGLE_ID: z.string().optional().default(""),
  AUTH_GOOGLE_SECRET: z.string().optional().default(""),
  AUTH_TRUST_HOST: boolString.default("true"),

  // Admin
  ADMIN_EMAILS: z.string().default(""),
  ADMIN_PASSWORD: z.string().optional().default("admin123"),

  // Sepay
  SEPAY_BANK: z.string().default("MBBank"),
  SEPAY_ACCOUNT: z.string().default(""),
  SEPAY_ACCOUNT_NAME: z.string().default("Anh Táo Mobile"),
  SEPAY_WEBHOOK_SECRET: z.string().default(""),

  // Referral
  REFERRAL_RATE: z
    .string()
    .default("0.1")
    .transform((v) => {
      const n = Number(v);
      if (Number.isNaN(n) || n < 0 || n > 1) throw new Error("REFERRAL_RATE must be 0..1");
      return n;
    }),

  // Upstash (optional)
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().default(""),

  // Resend (optional)
  RESEND_API_KEY: z.string().optional().default(""),
  EMAIL_FROM: z.string().default("orders@anhtaomobile.vn"),
  EMAIL_REPLY_TO: z.string().default("support@anhtaomobile.vn"),

  // Sentry (optional)
  SENTRY_DSN: z.string().optional().default(""),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().default(""),
  SENTRY_ORG: z.string().optional().default(""),
  SENTRY_PROJECT: z.string().optional().default(""),

  // Security
  IP_SALT: z.string().min(8, "IP_SALT must be set"),
  DOWNLOAD_IP_SALT: z.string().min(8, "DOWNLOAD_IP_SALT must be set"),
  CRON_SECRET: z.string().default(""),

  // Branding
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://anhtaomobile.vn"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Anh Táo Mobile"),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().default("support@anhtaomobile.vn"),
  NEXT_PUBLIC_BUSINESS_NAME: z.string().default("Anh Táo Mobile"),
  NEXT_PUBLIC_BUSINESS_TAX_ID: z.string().default(""),
  NEXT_PUBLIC_BUSINESS_ADDRESS: z.string().default("1013 Cách Mạng Tháng 8, P. Phú Cường, TP. Thủ Dầu Một, Bình Dương"),
  NEXT_PUBLIC_HOTLINE: z.string().default("0819000011"),
  NEXT_PUBLIC_ZALO: z.string().default("0819000011"),
  NEXT_PUBLIC_MESSENGER: z.string().default("https://m.me/anhtaobinhduongg"),
  NEXT_PUBLIC_MAPS_URL: z
    .string()
    .default("https://maps.google.com/?q=Anh+Tao+Mobile+1013+CMT8+Thu+Dau+Mot+Binh+Duong"),

  NODE_ENV: z.string().default("development"),
});

function parseEnv() {
  if (typeof window !== "undefined") {
    return {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://anhtaomobile.vn",
      NEXT_PUBLIC_BUSINESS_NAME: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Anh Táo Mobile",
      NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@anhtaomobile.vn",
      NEXT_PUBLIC_BUSINESS_TAX_ID: process.env.NEXT_PUBLIC_BUSINESS_TAX_ID || "",
      NEXT_PUBLIC_BUSINESS_ADDRESS: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "1013 Cách Mạng Tháng 8, P. Phú Cường, TP. Thủ Dầu Một, Bình Dương",
      NEXT_PUBLIC_HOTLINE: process.env.NEXT_PUBLIC_HOTLINE || "0819000011",
      NEXT_PUBLIC_ZALO: process.env.NEXT_PUBLIC_ZALO || "0819000011",
      NEXT_PUBLIC_MESSENGER: process.env.NEXT_PUBLIC_MESSENGER || "https://m.me/anhtaobinhduongg",
      NEXT_PUBLIC_MAPS_URL: process.env.NEXT_PUBLIC_MAPS_URL || "https://maps.google.com/?q=Anh+Tao+Mobile+1013+CMT8+Thu+Dau+Mot+Binh+Duong",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
      ADMIN_EMAILS: "",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
      RESEND_API_KEY: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      AUTH_GOOGLE_ID: "",
      AUTH_GOOGLE_SECRET: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
    } as any;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`\n❌ Invalid environment variables:\n${issues}\n`);
  }
  return parsed.data;
}

export const env = parseEnv();

export const adminEmails = env.ADMIN_EMAILS
  .split(",")
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

export const hasSupabase = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
);
export const hasResend = Boolean(env.RESEND_API_KEY);
export const hasUpstash = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);
export const hasGoogleAuth = Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);
export const hasSentry = Boolean(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN);
