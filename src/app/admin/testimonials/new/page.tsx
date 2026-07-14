import Link from "next/link";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { createTestimonial } from "../actions";

export const metadata = { title: "Thêm đánh giá — Quản trị" };

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thêm đánh giá khách hàng</h1>
        <Link href="/admin/testimonials" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
