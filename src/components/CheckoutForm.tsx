"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatVND } from "@/lib/format";
import { env } from "@/lib/env";

type Line = { id: string; title: string; price: number; qty: number };

export function CheckoutForm({ lines, subtotal }: { lines: Line[]; subtotal: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const referralCode =
      (typeof window !== "undefined" && localStorage.getItem("referralCode")) || undefined;
    const body = {
      items: lines.map((l) => ({ productId: l.id, qty: l.qty })),
      buyerName: form.get("buyerName"),
      buyerEmail: form.get("buyerEmail"),
      buyerPhone: form.get("buyerPhone"),
      buyerAddress: form.get("buyerAddress") || undefined,
      fulfillment: form.get("fulfillment"),
      couponCode: form.get("couponCode") || undefined,
      referralCode,
      note: form.get("note") || undefined,
    };
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không thể tạo đơn");
      router.push(`/checkout/success?order=${data.publicCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface-card p-5 flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Họ tên" name="buyerName" required />
        <Field label="Số điện thoại" name="buyerPhone" required type="tel" placeholder="09xxxxxxxx" />
        <Field label="Email" name="buyerEmail" required type="email" />
        <Field label="Địa chỉ (nếu giao hàng)" name="buyerAddress" />
      </div>

      <div>
        <label className="text-sm font-medium">Hình thức</label>
        <select name="fulfillment" className="input-token mt-1" defaultValue="at_shop">
          <option value="at_shop">Mua tại shop</option>
          <option value="shipping">Giao hàng</option>
          <option value="hold">Đặt giữ máy</option>
          <option value="consult">Cần tư vấn thêm</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Mã giảm giá" name="couponCode" placeholder="VD: ANHTAO10" />
        <Field label="Ghi chú" name="note" />
      </div>

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Đang tạo đơn..." : `Đặt mua — ${formatVND(subtotal)}`}
      </button>
      <p className="text-xs text-muted-token">
        Sau khi đặt, bạn sẽ nhận mã đơn và QR chuyển khoản Sepay (ngân hàng {env.SEPAY_BANK}). Nhân viên liên hệ xác nhận trong 30 phút.
      </p>
    </form>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="input-token mt-1" />
    </div>
  );
}
