"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";

export function DashboardActions() {
  const [busy, setBusy] = useState<string | null>(null);

  async function exportData() {
    setBusy("export");
    try {
      const res = await fetch("/api/account/export");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } finally { setBusy(null); }
  }

  async function deleteAccount() {
    if (!confirm("Xoá tài khoản? Thao tác không thể hoàn tác. Đơn hàng được ẩn danh nhưng vẫn lưu doanh số.")) return;
    setBusy("delete");
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (res.ok) window.location.href = "/";
    } finally { setBusy(null); }
  }

  return (
    <div className="flex gap-2">
      <button onClick={exportData} disabled={busy === "export"} className="btn btn-secondary">
        <Download className="h-4 w-4" /> {busy === "export" ? "..." : "Tải dữ liệu của tôi"}
      </button>
      <button onClick={deleteAccount} disabled={busy === "delete"} className="btn btn-danger">
        <Trash2 className="h-4 w-4" /> {busy === "delete" ? "..." : "Xoá tài khoản"}
      </button>
    </div>
  );
}
