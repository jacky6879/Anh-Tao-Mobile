import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCart } from "@/lib/cart";
import { formatVND } from "@/lib/format";
import { CartClient } from "@/components/CartClient";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Giỏ hàng", alternates: { canonical: "/gio-hang" } };

export default async function CartPage() {
  const cart = await getCart();
  const ids = cart.map((i) => i.productId);

  let products: Awaited<ReturnType<typeof list>> = [];
  try {
    products = await list(ids);
  } catch { /* DB */ }

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean) as (Awaited<ReturnType<typeof list>>[number] & { qty: number })[];

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng / Đặt giữ máy</h1>
      {lines.length === 0 ? (
        <EmptyState title="Giỏ hàng trống" description="Thêm máy bạn quan tâm vào giỏ để đặt giữ hoặc mua." />
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="flex flex-col gap-3">
            <CartClient lines={lines.map((l) => ({ id: l.id, slug: l.slug, title: l.title, price: l.price, coverImage: l.coverImage, qty: l.qty }))} />
          </div>
          <aside className="surface-card p-4 h-fit lg:sticky lg:top-20">
            <h2 className="font-semibold mb-3">Tóm tắt</h2>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-secondary-token">Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="border-t border-token my-3" />
            <div className="flex justify-between font-bold mb-4">
              <span>Tổng</span><span className="text-[var(--brand-primary)]">{formatVND(subtotal)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full">Tiến hành đặt mua</Link>
            <Link href="/san-pham" className="btn btn-ghost w-full mt-2">Tiếp tục xem máy</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

async function list(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, slug: true, title: true, price: true, coverImage: true },
  });
}

