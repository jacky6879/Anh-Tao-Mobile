import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatVND, formatDateTime } from "@/lib/format";

export const metadata = { title: "Tra cứu đơn hàng", robots: { index: false } };

type Params = { params: Promise<{ publicCode: string }> };

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "Chờ thanh toán", cls: "badge-warning" },
  paid: { label: "Đã thanh toán", cls: "badge-success" },
  confirmed: { label: "Đã xác nhận", cls: "badge-success" },
  cancelled: { label: "Đã huỷ", cls: "badge-danger" },
  refunded: { label: "Đã hoàn tiền", cls: "badge-danger" },
  expired: { label: "Hết hạn", cls: "badge-muted" },
};

export default async function OrderStatusPage({ params }: Params) {
  const { publicCode } = await params;
  let order;
  try {
    order = await prisma.order.findUnique({
      where: { publicCode: publicCode.toUpperCase() },
      include: { items: true },
    });
  } catch { /* DB */ }

  if (!order) notFound();

  const st = STATUS_LABEL[order.status] ?? { label: order.status, cls: "badge-muted" };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Đơn hàng {order.publicCode}</h1>
      <p className="text-sm text-muted-token mb-4">Tạo lúc {formatDateTime(order.createdAt)}</p>
      <span className={`badge ${st.cls}`}>{st.label}</span>

      <div className="surface-card p-4 mt-6">
        <h2 className="font-semibold mb-3">Sản phẩm</h2>
        <div className="flex flex-col gap-2">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span className="text-secondary-token">{it.productTitleSnap} × {it.qty}</span>
              <span>{formatVND(it.priceSnap * it.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-token my-3" />
        <div className="flex justify-between text-sm"><span className="text-muted-token">Tạm tính</span><span>{formatVND(order.subtotal)}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-token">Giảm giá</span><span>-{formatVND(order.discount)}</span></div>}
        <div className="flex justify-between font-bold mt-2"><span>Tổng</span><span className="text-[var(--brand-primary)]">{formatVND(order.total)}</span></div>
      </div>

      <div className="surface-card p-4 mt-4 text-sm">
        <p><span className="text-muted-token">Người đặt:</span> {order.buyerName} · {order.buyerPhone}</p>
        {order.note && <p className="mt-1"><span className="text-muted-token">Ghi chú:</span> {order.note}</p>}
      </div>
    </div>
  );
}
