# Anh Táo Mobile

Website thương mại + landing page cho cửa hàng điện thoại di động **Anh Táo Mobile** (Bình Dương). Bán iPhone/iPad/MacBook cũ/mới, dịch vụ sửa chữa, thu cũ đổi mới, đặt lịch sửa chữa.

Stack: **Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Prisma 7 · Supabase Postgres · NextAuth v5**.

## Tính năng

- Landing page + catalog sản phẩm (iPhone, iPad, MacBook, smartphone) + trang chi tiết
- Dịch vụ sửa chữa (thay pin, màn hình, ép kính, chân sạc...) + đặt lịch
- Thu cũ đổi mới + form tư vấn (leads)
- Giỏ hàng / đặt mua / đặt giữ máy + checkout (QR Sepay)
- Trang tra cứu đơn hàng theo mã
- SEO landing pages (iPhone cũ Bình Dương, thay pin iPhone Bình Dương, ...)
- JSON-LD (LocalBusiness, Product, Service, Breadcrumb, FAQ), sitemap, robots
- Dark/light mode, responsive, CTA Zalo/Hotline/Messenger/Bản đồ
- Admin CMS: sản phẩm, danh mục, dịch vụ, đơn, lịch sửa chữa, thu cũ, leads, đánh giá, mã giảm giá, referral, audit log, xuất CSV, người dùng
- Dashboard người dùng: đơn hàng, mã giới thiệu, xuất dữ liệu / xoá tài khoản (NĐ 13)
- Bảo mật: Zod mọi input, env validation, rate limit (Upstash hoặc in-memory fallback), CSP, HMAC verify webhook Sepay, soft-delete

## Chạy local (không cần external services)

App dùng fallback cho Supabase/Resend/Upstash/Google OAuth khi chưa cấu hình — chạy được `dev` / `build` ngay.

```bash
cp .env.example .env
# Sửa AUTH_SECRET, IP_SALT, DOWNLOAD_IP_SALT (bất kỳ chuỗi ≥8 ký tự)
# DATABASE_URL: chuỗi Supabase pooler (port 6543). Để build mà chưa có DB, giữ placeholder.
npm install
npx prisma generate
npx prisma migrate dev    # cần DB thật
npm run db:seed
npm run dev
```

Đăng nhập dev (ngoài production): vào `/login`, nhập email bất kỳ (Google OAuth nếu đã cấu hình `AUTH_GOOGLE_ID/SECRET`). Email nằm trong `ADMIN_EMAILS` → tự cấp admin → vào `/admin`.

## Build

```bash
npm run typecheck
npm run build   # prisma generate && next build
```

## Biến môi trường

Xem `.env.example`. Bắt buộc khi chạy: `DATABASE_URL`, `AUTH_SECRET`, `IP_SALT`, `DOWNLOAD_IP_SALT`. Các dịch vụ ngoài (Supabase, Resend, Upstash, Google OAuth, Sepay, Sentry) tuỳ chọn — app dùng fallback nếu thiếu.

## Deploy Vercel + Supabase

1. Tạo Supabase project, lấy Transaction Pooler URL (port 6543) → `DATABASE_URL`, direct URL (5432) → `DIRECT_URL`.
2. Tạo 2 bucket Supabase Storage: `product-covers` (public), `product-assets` (private).
3. (Tuỳ chọn) Upstash Redis, Resend, Sentry, Google OAuth, Sepay.
4. Set toàn bộ env trên Vercel. Cron `expire-pending-orders` đã khai báo trong `vercel.json`.
5. `prisma migrate deploy` + `npm run db:seed`.

## Ghi chú

- Toàn bộ content nằm trong DB (không filesystem cho data động).
- Soft-delete cho Product/Category/RepairService/User (`deletedAt`).
- Webhook Sepay verify HMAC-SHA256 với `SEPAY_WEBHOOK_SECRET`; nếu thiếu secret, chỉ log cảnh báo (dev).
- Token tải file số (digital download) của brief gốc đã được thay bằng luồng đặt mua/giữ máy + repair booking + trade-in + leads.
