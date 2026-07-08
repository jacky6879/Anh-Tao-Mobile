"use client";

import { useState } from "react";

export function TradeInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/tradein", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Lỗi");
      setDone(`Đã gửi yêu cầu. Mã yêu cầu: ${json.publicCode}. Shop sẽ báo giá thu cũ sớm.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally { setLoading(false); }
  }

  if (done) return <div className="surface-card p-6 text-center"><p className="text-[var(--success)] font-medium">{done}</p></div>;

  return (
    <form onSubmit={onSubmit} className="surface-card p-5 flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Họ tên" name="customerName" required />
        <Field label="Số điện thoại" name="customerPhone" required type="tel" placeholder="09xxxxxxxx" />
      </div>
      <Field label="Email (tuỳ chọn)" name="customerEmail" type="email" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Máy đang dùng" name="currentDevice" required placeholder="VD: iPhone 11 64GB" />
        <Field label="Dung lượng" name="storage" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tình trạng pin" name="batteryHealth" placeholder="VD: 85%" />
        <Field label="Ngoại hình" name="cosmetic" placeholder="VD: Trầy nhẹ 2 cạnh" />
      </div>
      <Field label="Lỗi nếu có" name="faults" />
      <Field label="Máy muốn lên đời" name="wantedDevice" placeholder="VD: iPhone 14 Pro Max" />
      <div>
        <label className="text-sm font-medium">Ghi chú</label>
        <textarea name="note" rows={3} className="input-token mt-1" />
      </div>
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <button disabled={loading} className="btn btn-primary">{loading ? "Đang gửi..." : "Gửi yêu cầu thu cũ"}</button>
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
