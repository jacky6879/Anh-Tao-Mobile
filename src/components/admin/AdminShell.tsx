"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, Wrench, CalendarClock, RefreshCw,
  ShoppingCart, Users, Star, Ticket, Share2, FileText, ShieldCheck, Menu, X, Settings, FileEdit, MessageSquareQuote, LayoutTemplate
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Tags },
  { href: "/admin/repair-services", label: "Dịch vụ sửa chữa", icon: Wrench },
  { href: "/admin/orders", label: "Đơn đặt máy", icon: ShoppingCart },
  { href: "/admin/bookings", label: "Lịch sửa chữa", icon: CalendarClock },
  { href: "/admin/trade-in", label: "Thu cũ đổi mới", icon: RefreshCw },
  { href: "/admin/leads", label: "Khách hàng / Leads", icon: Users },
  { href: "/admin/reviews", label: "Đánh giá", icon: Star },
  { href: "/admin/testimonials", label: "Đánh giá khách hàng", icon: MessageSquareQuote },
  { href: "/admin/coupons", label: "Mã giảm giá", icon: Ticket },
  { href: "/admin/referrals", label: "Giới thiệu", icon: Share2 },
  { href: "/admin/blogs", label: "Bài viết / Blog", icon: FileEdit },
  { href: "/admin/audit-log", label: "Nhật ký", icon: FileText },
  { href: "/admin/users", label: "Người dùng", icon: ShieldCheck },
  { href: "/admin/content", label: "Nội dung trang", icon: LayoutTemplate },
  { href: "/admin/settings", label: "Cài đặt chung", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex gap-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden btn btn-ghost p-2 fixed top-20 left-2 z-50 surface-card"
        aria-label="Menu quản trị"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside className={`${open ? "block" : "hidden"} lg:block w-56 shrink-0`}>
        <nav className="surface-card p-2 sticky top-20 flex flex-col gap-0.5">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${active ? "bg-[var(--brand-primary)] text-white" : "hover:bg-[var(--bg-subtle)]"}`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
