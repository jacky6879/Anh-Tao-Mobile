import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCart } from "@/lib/cart";
import { formatVND } from "@/lib/format";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Thanh toán / Đặt giữ máy", robots: { index: false } };

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.length === 0) redirect("/gio-hang");

  let products: Awaited<ReturnType<typeof list>> = [];
  try { products = await list(cart.map((i) => i.productId)); } catch { /* DB */ }

  const lines = cart
    .map((item) => {
      const p = products.find((x) => x.id === item.productId);
      return p ? { ...p, qty: item.qty } : null;
    })
    .filter(Boolean) as (Awaited<ReturnType<typeof list>>[number] & { qty: number })[];

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán / Đặt giữ máy</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <CheckoutForm
          lines={lines.map((l) => ({ id: l.id, title: l.title, price: l.price, qty: l.qty }))}
          subtotal={subtotal}
        />
        <aside className="surface-card p-4 h-fit">
          <h2 className="font-semibold mb-3">Đơn của bạn</h2>
          <div className="flex flex-col gap-2 mb-3">
            {lines.map((l) => (
              <div key={l.id} className="flex justify-between text-sm">
                <span className="text-secondary-token line-clamp-1 pr-2">{l.title} × {l.qty}</span>
                <span className="whitespace-nowrap">{formatVND(l.price * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-token my-2" />
          <div className="flex justify-between font-bold"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
          <p className="text-xs text-muted-token mt-3">
            Phí ship (nếu giao hàng) sẽ được nhân viên báo khi xác nhận. Thanh toán cọc qua chuyển khoản Sepay.
          </p>
        </aside>
      </div>
    </div>
  );
}

async function list(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true, title: true, price: true } });
}
