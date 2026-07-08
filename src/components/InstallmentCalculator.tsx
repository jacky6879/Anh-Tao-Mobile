"use client";

import { useState } from "react";
import { formatVND } from "@/lib/format";

type ProductLight = {
  id: string;
  title: string;
  price: number;
};

export function InstallmentCalculator({ products }: { products: ProductLight[] }) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [prepayPercent, setPrepayPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(6);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const price = selectedProduct?.price || 0;

  // Lãi suất giả định (tham khảo)
  // Ví dụ: 2%/tháng lãi suất phẳng (flat rate)
  const monthlyInterestRate = 0.02; 
  
  const prepayAmount = (price * prepayPercent) / 100;
  const loanAmount = price - prepayAmount;
  
  const totalInterest = loanAmount * monthlyInterestRate * months;
  const totalPayable = loanAmount + totalInterest;
  const monthlyPayment = totalPayable / months;

  return (
    <div className="surface-card p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Bảng tính trả góp tham khảo</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Chọn sản phẩm</label>
            <select
              className="input bg-[var(--bg-subtle)]"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Chọn máy bạn muốn mua --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - {formatVND(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 flex justify-between">
              <span>Trả trước ({prepayPercent}%)</span>
              <span className="text-[var(--brand-primary)] font-semibold">{formatVND(prepayAmount)}</span>
            </label>
            <input
              type="range"
              min="10"
              max="80"
              step="10"
              value={prepayPercent}
              onChange={(e) => setPrepayPercent(Number(e.target.value))}
              className="w-full accent-[var(--brand-primary)]"
            />
            <div className="flex justify-between text-xs text-muted-token mt-1">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Kỳ hạn vay</label>
            <div className="flex gap-2">
              {[6, 9, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`flex-1 py-2 text-sm rounded-md border transition-colors ${
                    months === m
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-semibold"
                      : "border-token hover:border-[var(--brand-primary)]"
                  }`}
                >
                  {m} tháng
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-subtle)] p-6 rounded-lg flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-muted-token uppercase mb-4">Kết quả dự tính</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-token">Giá máy:</span>
              <span className="font-medium">{formatVND(price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-token">Cần trả trước:</span>
              <span className="font-medium">{formatVND(prepayAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-token">Khoản vay:</span>
              <span className="font-medium">{formatVND(loanAmount)}</span>
            </div>
            <div className="border-t border-token pt-3 mt-3 flex justify-between items-center">
              <span className="font-medium text-base">Góp mỗi tháng:</span>
              <span className="text-2xl font-bold text-[var(--danger)]">
                {price > 0 ? formatVND(monthlyPayment) : "0 ₫"}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-token mt-4 italic">
            * Số tiền trên chỉ mang tính chất tham khảo. Lãi suất thực tế tuỳ thuộc vào công ty tài chính và hồ sơ của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
