"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User, Shield } from "lucide-react";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Mở menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="btn btn-ghost p-2"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 surface-card border-b border-token p-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--bg-subtle)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export function UserActions() {
  const [state, setState] = useState<{ loading: boolean; isAdmin: boolean; name?: string }>({
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (s?.user) setState({ loading: false, isAdmin: !!s.user.isAdmin, name: s.user.name });
        else setState({ loading: false, isAdmin: false });
      })
      .catch(() => setState({ loading: false, isAdmin: false }));
  }, []);

  if (state.loading) return null;

  if (!state.name) {
    return (
      <Link href="/login" className="btn btn-ghost p-2" aria-label="Đăng nhập">
        <User className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {state.isAdmin && (
        <Link href="/admin" className="btn btn-ghost p-2" aria-label="Quản trị" title="Quản trị">
          <Shield className="h-5 w-5" />
        </Link>
      )}
      <Link href="/dashboard" className="btn btn-ghost p-2 hidden sm:inline-flex" aria-label="Tài khoản">
        <User className="h-5 w-5" />
      </Link>
      <button
        type="button"
        onClick={async () => {
          const r = await fetch("/api/auth/csrf");
          const { csrfToken } = await r.json();
          const body = new URLSearchParams({ csrfToken, callbackUrl: "/" });
          await fetch("/api/auth/signout", { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
          window.location.href = "/";
        }}
        className="btn btn-ghost p-2"
        aria-label="Đăng xuất"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}

export function CartBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    try {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("cart="))
        ?.split("=")[1];
      if (!raw) return;
      const cart = JSON.parse(decodeURIComponent(raw)) as { qty: number }[];
      setCount(cart.reduce((s, i) => s + i.qty, 0));
    } catch {
      /* noop */
    }
  }, []);
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-[var(--danger)] text-white text-xs flex items-center justify-center">
      {count}
    </span>
  );
}
