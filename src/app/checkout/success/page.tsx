import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/format";
import { buildSepayQrUrl } from "@/lib/orders";
import { env } from "@/lib/env";
import { CheckCircle2 } from "lucide-react";

// Order-specific, DB-backed; render per request
export const dynamic = "force-dynamic";

export const metadata = { title: "Đặt hàng thành công", robots: { index: false } };

type Search = { searchParams: Promise<{ order?: string }> };

export default async function SuccessPage({ searchParams }: Search) {
  const { order: publicCode } = await searchParams;
  let order: Awaited<ReturnType<typeof get>> = null;
  try { order = await get(publicCode); } catch { /* DB */ }

  const qrUrl = order?.paymentMemo ? buildSepayQrUrl(order.total, order.paymentMemo) : null;

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <CheckCircle2 className="h-14 w-14 mx-auto text-[var(--success)] mb-3" />
      <h1 className="text-2xl font-bold mb-1">Đã nhận đơn hàng</h1>
      <p className="text-secondary-token text-sm mb-6">Cảm ơn bạn! Đơn đang chờ thanh toán / xác nhận.</p>

      {order && (
        <div className="surface-card p-5 text-left mb-6">
          <div className="flex justify-between text-sm mb-1"><span className="text-muted-token">Mã đơn</span><span className="font-bold">{order.publicCode}</span></div>
          <div className="flex justify-between text-sm mb-1"><span className="text-muted-token">Tổng</span><span className="font-bold text-[var(--brand-primary)]">{formatVND(order.total)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-token">Trạng thái</span><span className="badge badge-warning">Chờ thanh toán</span></div>

          {order.paymentMemo && (
            <div className="mt-4 border-t border-token pt-4">
              <p className="text-sm font-medium mb-1">Chuyển khoản với nội dung:</p>
              <p className="font-mono text-sm bg-[var(--bg-subtle)] p-2 rounded">{order.paymentMemo}</p>
              <p className="text-xs text-muted-token mt-1">{env.SEPAY_BANK} — {env.SEPAY_ACCOUNT} — {env.SEPAY_ACCOUNT_NAME}</p>
              {qrUrl && <img src={qrUrl} alt="QR Sepay" width={220} height={220} className="mx-auto mt-3" />}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-secondary-token mb-4">
        Bạn có thể xem trạng thái đơn bất cứ lúc nào qua mã đơn.
      </p>
      <div className="flex gap-2 justify-center">
        {order && <Link href={`/order/${order.publicCode}`} className="btn btn-secondary">Xem đơn hàng</Link>}
        <Link href="/san-pham" className="btn btn-ghost">Tiếp tục mua</Link>
      </div>
    </div>
  );
}

async function get(publicCode?: string) {
  if (!publicCode) return null;
  return prisma.order.findUnique({
    where: { publicCode },
    select: { publicCode: true, total: true, status: true, paymentMemo: true },
  });
}
