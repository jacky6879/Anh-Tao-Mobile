"use client";

import { useState } from "react";

export function BookingForm({ serviceId, services }: { serviceId?: string; services: { id: string; title: string }[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Lỗi");
      setDone(`Đã đặt lịch. Mã đặt lịch: ${json.publicCode}. Nhân viên sẽ liên hệ xác nhận.`);
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
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Email (tuỳ chọn)" name="customerEmail" type="email" />
        <Field label="Dòng máy" name="deviceModel" placeholder="VD: iPhone 13 Pro" />
      </div>
      {services.length > 0 && (
        <div>
          <label className="text-sm font-medium">Dịch vụ mong muốn</label>
          <select name="serviceId" defaultValue={serviceId} className="input-token mt-1">
            <option value="">— Chọn dịch vụ —</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="text-sm font-medium">Lỗi gặp phải *</label>
        <textarea name="fault" required rows={3} className="input-token mt-1" placeholder="Mô tả tình trạng máy..." />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Thời gian muốn ghé" name="scheduledAt" type="datetime-local" />
        <Field label="Ghi chú" name="note" />
      </div>
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <button disabled={loading} className="btn btn-primary">{loading ? "Đang gửi..." : "Đặt lịch sửa chữa"}</button>
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

