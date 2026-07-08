"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "./actions";

export function SettingsClient({ defaultValues }: { defaultValues: Record<string, string> }) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(defaultValues);
  const [msg, setMsg] = useState("");

  const handleChange = (k: string, v: string) => setData((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    startTransition(async () => {
      try {
        await saveSettings(data);
        setMsg("✅ Đã lưu cài đặt thành công!");
      } catch (err) {
        setMsg("❌ Có lỗi xảy ra khi lưu.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6 max-w-2xl flex flex-col gap-6">
      {/* ===== Thông tin cửa hàng ===== */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg">🏪 Thông tin cửa hàng</h3>
        <SettingField label="Tên cửa hàng" settingKey="businessName" value={data.businessName} onChange={handleChange} placeholder="Anh Táo Mobile" />
        <SettingField label="Email liên hệ" settingKey="email" value={data.email} onChange={handleChange} placeholder="contact@anhtaomobile.vn" type="email" />
      </div>

      {/* ===== Thông tin liên hệ ===== */}
      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6">
        <h3 className="font-semibold text-lg">📞 Thông tin liên hệ</h3>
        <SettingField label="Hotline" settingKey="hotline" value={data.hotline} onChange={handleChange} placeholder="0900000000" />
        <SettingField label="Zalo" settingKey="zalo" value={data.zalo} onChange={handleChange} placeholder="0900000000" />
        <SettingField label="Messenger (Link)" settingKey="messenger" value={data.messenger} onChange={handleChange} placeholder="https://m.me/..." />
        <SettingField label="Địa chỉ" settingKey="address" value={data.address} onChange={handleChange} placeholder="Bình Dương..." />
        <SettingField label="Google Maps Embed URL" settingKey="googleMapsUrl" value={data.googleMapsUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..." />
      </div>

      {/* ===== Nội dung Trang Chủ ===== */}
      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6">
        <h3 className="font-semibold text-lg">🏠 Nội dung Trang Chủ</h3>
        <SettingField label="Slogan (Tiêu đề chính)" settingKey="heroTitle" value={data.heroTitle} onChange={handleChange} placeholder="Chào mừng đến với Anh Táo Mobile" />
        <div>
          <label className="text-sm font-medium mb-1 block">Mô tả ngắn (Dưới tiêu đề)</label>
          <textarea className="input min-h-[100px]" value={data.heroSubtitle || ""} onChange={(e) => handleChange("heroSubtitle", e.target.value)} placeholder="Mua bán, sửa chữa điện thoại..." />
        </div>
        <SettingField label="Banner thông báo (hiển thị trên header)" settingKey="announcementBanner" value={data.announcementBanner} onChange={handleChange} placeholder="🔥 SALE cuối tuần - Giảm đến 2 triệu!" />
      </div>

      {/* ===== Cấu hình Trả Góp ===== */}
      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6">
        <h3 className="font-semibold text-lg">💳 Cấu hình Trả Góp</h3>
        <p className="text-xs text-[var(--text-muted)]">Lãi suất và kỳ hạn hiển thị trên bảng tính trả góp cho khách hàng.</p>
        <SettingField label="Lãi suất hàng tháng (%)" settingKey="installmentRate" value={data.installmentRate} onChange={handleChange} placeholder="2" type="number" />
        <SettingField label="Các kỳ hạn (tháng, cách nhau bởi dấu phẩy)" settingKey="installmentTerms" value={data.installmentTerms} onChange={handleChange} placeholder="6, 9, 12" />
      </div>

      {/* ===== Footer ===== */}
      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6">
        <h3 className="font-semibold text-lg">📝 Footer & Khác</h3>
        <div>
          <label className="text-sm font-medium mb-1 block">Giờ mở cửa</label>
          <textarea className="input min-h-[60px]" value={data.openingHours || ""} onChange={(e) => handleChange("openingHours", e.target.value)} placeholder="T2 - CN: 8:00 - 21:00" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Nội dung chân trang (HTML)</label>
          <textarea className="input min-h-[80px] font-mono text-sm" value={data.footerHtml || ""} onChange={(e) => handleChange("footerHtml", e.target.value)} placeholder="<p>© 2026 Anh Táo Mobile</p>" />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-[var(--border)] pt-6">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Đang lưu..." : "💾 Lưu thay đổi"}
        </button>
        {msg && <span className={`text-sm ${msg.startsWith("✅") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>{msg}</span>}
      </div>
    </form>
  );
}

function SettingField({ label, settingKey, value, onChange, placeholder, type = "text" }: {
  label: string;
  settingKey: string;
  value: string | undefined;
  onChange: (k: string, v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <input className="input" type={type} value={value || ""} onChange={(e) => onChange(settingKey, e.target.value)} placeholder={placeholder} />
    </div>
  );
}

