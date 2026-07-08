"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { fulfillOrder } from "@/lib/orders";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";

export async function confirmOrder(id: string) {
  const session = await requireAdmin();
  try {
    await fulfillOrder(id, session.user.id);
    await setFlash({ type: "success", message: "Đã xác nhận thanh toán đơn" });
  } catch (e) {
    await setFlash({ type: "error", message: e instanceof Error ? e.message : "Lỗi xác nhận" });
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect("/admin/orders");
}

export async function cancelOrder(id: string) {
  const session = await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "cancelled", cancelledAt: new Date() } });
  await writeAudit({ userId: session.user.id, action: "reject", entityType: "Order", entityId: id, metadata: {} });
  revalidatePath("/admin/orders");
  await setFlash({ type: "success", message: "Đã huỷ đơn" });
  redirect("/admin/orders");
}

export async function refundOrder(id: string) {
  const session = await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "refunded" } });
  await writeAudit({ userId: session.user.id, action: "revoke", entityType: "Order", entityId: id, metadata: {} });
  revalidatePath("/admin/orders");
  await setFlash({ type: "success", message: "Đã hoàn tiền đơn" });
  redirect("/admin/orders");
}
