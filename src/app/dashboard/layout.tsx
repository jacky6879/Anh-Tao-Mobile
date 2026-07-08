import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { env } from "@/lib/env";

export const metadata = { title: { absolute: "Tài khoản — Anh Táo Mobile" }, robots: { index: false, follow: false } };

const NAV = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/dashboard/orders", label: "Đơn hàng" },
  { href: "/dashboard/settings", label: "Cài đặt" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  const code = session.user.referralCode;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Xin chào, {session.user.name ?? session.user.email}</h1>
      </div>
      <div className="grid md:grid-cols-[180px_1fr] gap-6">
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => <Link key={n.href} href={n.href} className="px-3 py-2 rounded-md text-sm hover:bg-[var(--bg-subtle)]">{n.label}</Link>)}
          <a href="/api/auth/signout" className="px-3 py-2 rounded-md text-sm text-[var(--danger)] hover:bg-[var(--bg-subtle)]">Đăng xuất</a>
        </nav>
        <div>
          {code && (
            <div className="surface-card p-4 mb-4 text-sm">
              <p className="font-semibold mb-1">Mã giới thiệu của bạn</p>
              <p className="font-mono text-[var(--brand-primary)]">{code}</p>
              <p className="text-xs text-muted-token mt-1">
                Chia sẻ link: <span className="font-mono">{env.NEXT_PUBLIC_SITE_URL}/?ref={code}</span> — nhận {Math.round(Number(env.REFERRAL_RATE) * 100)}% hoa hồng khi bạn bè mua máy.
              </p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
