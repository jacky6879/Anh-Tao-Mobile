"use client";

import { useState } from "react";

export function LeadForm({ type = "consult", productId }: { type?: string; productId?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, type, productId }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Lỗi");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally { setLoading(false); }
  }

  if (done) return <p className="text-[var(--success)] text-sm">Cảm ơn bạn! Anh Táo sẽ liên hệ sớm.</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input name="customerName" required placeholder="Họ tên" className="input-token" />
      <input name="customerPhone" required type="tel" placeholder="Số điện thoại" className="input-token" />
      <input name="customerEmail" type="email" placeholder="Email (tuỳ chọn)" className="input-token" />
      <textarea name="message" rows={3} placeholder="Nội dung" className="input-token" />
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <button disabled={loading} className="btn btn-primary">{loading ? "Đang gửi..." : "Gửi"}</button>
    </form>
  );
}
