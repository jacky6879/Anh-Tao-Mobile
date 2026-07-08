import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatVND, formatDateTime } from "@/lib/format";
import { buildSepayQrUrl } from "@/lib/orders";
import { OrderActions } from "@/components/admin/OrderActions";
import { confirmOrder, cancelOrder, refundOrder } from "../actions";

export const metadata = { title: "Chi tiết đơn — Quản trị" };

type Params = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Params) {
  const { id } = await params;
  let order;
  try {
    order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  } catch { /* DB */ }
  if (!order) notFound();

  const qr = order.paymentMemo ? buildSepayQrUrl(order.total, order.paymentMemo) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Đơn {order.publicCode}</h1>
          <p className="text-sm text-muted-token">Tạo {formatDateTime(order.createdAt)}</p>
        </div>
        <Link href="/admin/orders" className="btn btn-ghost">← Quay lại</Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="surface-card p-4">
            <h2 className="font-semibold mb-2">Sản phẩm</h2>
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

          <div className="surface-card p-4 text-sm">
            <h2 className="font-semibold mb-2">Khách</h2>
            <p>{order.buyerName} · {order.buyerPhone}</p>
            <p className="text-muted-token">{order.buyerEmail}</p>
            {order.buyerAddress && <p>Địa chỉ: {order.buyerAddress}</p>}
            <p className="mt-1">Hình thức: <b>{order.fulfillment}</b></p>
            {order.note && <p className="mt-2"><span className="text-muted-token">Ghi chú:</span> {order.note}</p>}
          </div>
        </div>

        <aside className="surface-card p-4 h-fit">
          <h2 className="font-semibold mb-2">Thanh toán</h2>
          <p className="text-sm mb-1">Trạng thái: <span className="badge badge-muted">{order.status}</span></p>
          {order.paymentMemo && <p className="text-sm"><span className="text-muted-token">Memo:</span> <span className="font-mono">{order.paymentMemo}</span></p>}
          {qr && <img src={qr} alt="QR" width={220} className="mx-auto my-2" />}
          {order.paidAt && <p className="text-sm text-muted-token">Thanh toán lúc {formatDateTime(order.paidAt)}</p>}

          <div className="border-t border-token my-3" />
          <div className="flex flex-col gap-2">
            {order.status === "pending" && (
              <OrderActions label="Xác nhận đã thanh toán" action={confirmOrder.bind(null, id)} variant="primary" />
            )}
            {(order.status === "pending" || order.status === "paid") && (
              <OrderActions label="Huỷ đơn" action={cancelOrder.bind(null, id)} variant="ghost" confirm />
            )}
            {order.status === "paid" && (
              <OrderActions label="Hoàn tiền" action={refundOrder.bind(null, id)} variant="danger" confirm />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
