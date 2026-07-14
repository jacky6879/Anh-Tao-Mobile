"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import type { ReviewStatus } from "@prisma/client";

function parseForm(formData: FormData) {
  const ratingRaw = Number(formData.get("rating"));
  const orderRaw = Number(formData.get("order"));
  const status = String(formData.get("status") || "published");
  const allowedStatus = ["pending", "published", "hidden"];
  return {
    customerName: String(formData.get("customerName") || "").trim(),
    productName: (String(formData.get("productName") || "").trim()) || null,
    comment: String(formData.get("comment") || "").trim(),
    avatarImage: (String(formData.get("avatarImage") || "").trim()) || null,
    photoImage: (String(formData.get("photoImage") || "").trim()) || null,
    rating: Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, ratingRaw)) : 5,
    order: Number.isFinite(orderRaw) ? orderRaw : 0,
    status: (allowedStatus.includes(status) ? status : "published") as ReviewStatus,
    featured: formData.get("featured") === "on",
  };
}

export async function createTestimonial(formData: FormData) {
  const session = await requireAdmin();
  const data = parseForm(formData);
  if (!data.customerName || !data.comment) {
    await setFlash({ type: "error", message: "Cần nhập tên khách và nội dung đánh giá" });
    return;
  }
  const t = await prisma.testimonial.create({ data });
  await writeAudit({ userId: session.user.id, action: "create", entityType: "Testimonial", entityId: t.id, metadata: {} });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  await setFlash({ type: "success", message: "Đã thêm đánh giá khách hàng" });
}

export async function updateTestimonial(id: string, formData: FormData) {
  const session = await requireAdmin();
  const data = parseForm(formData);
  if (!data.customerName || !data.comment) {
    await setFlash({ type: "error", message: "Cần nhập tên khách và nội dung đánh giá" });
    return;
  }
  await prisma.testimonial.update({ where: { id }, data });
  await writeAudit({ userId: session.user.id, action: "update", entityType: "Testimonial", entityId: id, metadata: {} });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  await setFlash({ type: "success", message: "Đã cập nhật đánh giá" });
}

export async function deleteTestimonial(id: string) {
  const session = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await writeAudit({ userId: session.user.id, action: "delete", entityType: "Testimonial", entityId: id, metadata: {} });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  await setFlash({ type: "success", message: "Đã xoá đánh giá" });
}

export async function setTestimonialStatus(id: string, status: ReviewStatus) {
  const session = await requireAdmin();
  await prisma.testimonial.update({ where: { id }, data: { status } });
  await writeAudit({ userId: session.user.id, action: status === "published" ? "publish" : "update", entityType: "Testimonial", entityId: id, metadata: { status } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
