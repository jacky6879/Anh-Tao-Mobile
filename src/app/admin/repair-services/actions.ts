"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { repairServiceSchema } from "@/lib/schemas";
import { uniqueSlug, slugExistsService } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import type { ProductStatus } from "@prisma/client";

function cleanRaw(raw: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) out[k] = v === "" ? undefined : v;
  return out;
}

export async function createService(formData: FormData) {
  const session = await requireAdmin();
  const raw = cleanRaw(Object.fromEntries(formData.entries()));
  const tags = (formData.get("tags") as string | null)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const parsed = repairServiceSchema.parse({ ...raw, tags });
  const slug = await uniqueSlug(parsed.title, slugExistsService);
  const service = await prisma.repairService.create({
    data: {
      ...parsed,
      slug,
      status: parsed.status as ProductStatus,
      coverImage: parsed.coverImage || null,
      publishedAt: parsed.status === "published" ? new Date() : null,
    },
  });
  await writeAudit({ userId: session.user.id, action: "create", entityType: "RepairService", entityId: service.id, metadata: { slug } });
  revalidatePath("/sua-chua");
  await setFlash({ type: "success", message: `Đã tạo dịch vụ ${service.title}` });
  redirect("/admin/repair-services");
}

export async function updateService(id: string, formData: FormData) {
  const session = await requireAdmin();
  const raw = cleanRaw(Object.fromEntries(formData.entries()));
  const tags = (formData.get("tags") as string | null)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const parsed = repairServiceSchema.parse({ ...raw, tags });
  const existing = await prisma.repairService.findUniqueOrThrow({ where: { id } });
  await prisma.repairService.update({
    where: { id },
    data: {
      ...parsed,
      status: parsed.status as ProductStatus,
      coverImage: parsed.coverImage || null,
      publishedAt: parsed.status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });
  await writeAudit({ userId: session.user.id, action: "update", entityType: "RepairService", entityId: id, metadata: {} });
  revalidatePath("/sua-chua");
  revalidatePath(`/sua-chua/${existing.slug}`);
  await setFlash({ type: "success", message: "Đã cập nhật dịch vụ" });
  redirect("/admin/repair-services");
}

export async function deleteService(id: string) {
  const session = await requireAdmin();
  await prisma.repairService.update({ where: { id }, data: { deletedAt: new Date(), status: "archived" } });
  await writeAudit({ userId: session.user.id, action: "delete", entityType: "RepairService", entityId: id, metadata: {} });
  revalidatePath("/admin/repair-services");
  revalidatePath("/sua-chua");
  await setFlash({ type: "success", message: "Đã xoá dịch vụ" });
}
