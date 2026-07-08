import { TradeInForm } from "@/components/TradeInForm";

export const metadata = {
  title: "Gửi máy thu cũ — đổi mới iPhone",
  description: "Gửi thông tin máy cũ, Anh Táo Mobile báo giá thu cũ rồi trừ vào máy mới. Nhanh, rõ ràng, không ép giá.",
  alternates: { canonical: "/gui-may-thu-cu" },
};

export default function TradeInSubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Gửi máy thu cũ đổi mới</h1>
      <p className="text-secondary-token text-sm mb-6">Điền thông tin máy đang dùng, shop báo giá thu cũ trong 30 phút.</p>
      <TradeInForm />
      <div className="surface-subtle p-4 rounded-lg mt-6 text-sm text-secondary-token">
        <p>💡 Mẹo: mô tả thật chi tiết tình trạng máy (pin, ngoại hình, lỗi) để shop báo giá chính xác nhất.</p>
      </div>
    </div>
  );
}

