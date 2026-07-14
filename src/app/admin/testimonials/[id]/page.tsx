import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { updateTestimonial } from "../actions";

export const metadata = { title: "Sửa đánh giá — Quản trị" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sửa đánh giá khách hàng</h1>
        <Link href="/admin/testimonials" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <TestimonialForm action={updateTestimonial.bind(null, id)} testimonial={testimonial} />
    </div>
  );
}
