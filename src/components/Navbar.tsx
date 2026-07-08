import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { env } from "@/lib/env";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/NavbarClient";
import { UserActions } from "@/components/NavbarClient";
import { CartBadge } from "@/components/NavbarClient";
import { CategoryNav } from "@/components/CategoryNav";

const links = [
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/sua-chua", label: "Sửa chữa" },
  { href: "/thu-cu-doi-moi", label: "Thu cũ đổi mới" },
  { href: "/tra-gop", label: "Trả góp" },
  { href: "/bao-hanh", label: "Bảo hành" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/blog", label: "Blog" },
];

export async function Navbar() {
  return (
    <header className="sticky top-0 z-40 surface-card border-b border-token">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MobileMenu links={links} />
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-primary)] text-white">
                AT
              </span>
              <span className="hidden sm:inline">{env.NEXT_PUBLIC_SITE_NAME}</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-secondary-token hover:text-primary-token hover:bg-[var(--bg-subtle)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <UserActions />
            <Link href="/gio-hang" aria-label="Giỏ hàng" className="btn btn-ghost p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <CategoryNav />
    </header>
  );
}
