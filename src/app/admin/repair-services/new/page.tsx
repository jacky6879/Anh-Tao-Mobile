import Link from "next/link";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createService } from "../actions";

export const metadata = { title: "Thêm dịch vụ — Quản trị" };

export default function NewServicePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thêm dịch vụ sửa chữa</h1>
        <Link href="/admin/repair-services" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <ServiceForm action={createService} />
    </div>
  );
}
