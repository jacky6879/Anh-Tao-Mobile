"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/schemas";
import { uniqueSlug, slugExistsProduct } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import type { ProductStatus, ProductCondition } from "@prisma/client";

/** Drop empty strings for optional numeric fields so Zod coerce doesn't choke. */
function cleanRaw(raw: Record<string, unknown>): Record<string, unknown> {
  const numericOptional = ["batteryHealth", "comparePrice"];
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (numericOptional.includes(k) && v === "") out[k] = undefined;
    else out[k] = v;
  }
  return out;
}

export async function createProduct(formData: FormData) {
  const session = await requireAdmin();
  const raw = cleanRaw(Object.fromEntries(formData.entries()));
  const tags = (formData.get("tags") as string | null)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const gallery = (formData.get("gallery") as string | null)?.split("\n").map((g) => g.trim()).filter(Boolean) ?? [];
  const parsed = productSchema.parse({ ...raw, tags, gallery });

  const slug = await uniqueSlug(parsed.title, slugExistsProduct);
  const product = await prisma.product.create({
    data: {
      ...parsed,
      slug,
      batteryHealth: parsed.batteryHealth ?? null,
      comparePrice: parsed.comparePrice ?? null,
      categoryId: parsed.categoryId || null,
      coverImage: parsed.coverImage || null,
      condition: parsed.condition as ProductCondition,
      status: parsed.status as ProductStatus,
      publishedAt: parsed.status === "published" ? new Date() : null,
    },
  });
  await writeAudit({ userId: session.user.id, action: "create", entityType: "Product", entityId: product.id, metadata: { slug } });
  revalidatePath("/san-pham");
  await setFlash({ type: "success", message: `Đã tạo sản phẩm ${product.title}` });
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await requireAdmin();
  const raw = cleanRaw(Object.fromEntries(formData.entries()));
  const tags = (formData.get("tags") as string | null)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const gallery = (formData.get("gallery") as string | null)?.split("\n").map((g) => g.trim()).filter(Boolean) ?? [];
  const parsed = productSchema.parse({ ...raw, tags, gallery });

  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  await prisma.product.update({
    where: { id },
    data: {
      ...parsed,
      batteryHealth: parsed.batteryHealth ?? null,
      comparePrice: parsed.comparePrice ?? null,
      categoryId: parsed.categoryId || null,
      coverImage: parsed.coverImage || null,
      condition: parsed.condition as ProductCondition,
      status: parsed.status as ProductStatus,
      publishedAt: parsed.status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });
  await writeAudit({ userId: session.user.id, action: "update", entityType: "Product", entityId: id, metadata: {} });
  revalidatePath("/san-pham");
  revalidatePath(`/san-pham/${existing.slug}`);
  await setFlash({ type: "success", message: "Đã cập nhật sản phẩm" });
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await requireAdmin();
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date(), status: "archived" } });
  await writeAudit({ userId: session.user.id, action: "delete", entityType: "Product", entityId: id, metadata: {} });
  revalidatePath("/san-pham");
  revalidatePath("/admin/products");
  await setFlash({ type: "success", message: "Đã xoá sản phẩm" });
}

export async function setProductStatus(id: string, status: "published" | "archived" | "draft") {
  const session = await requireAdmin();
  await prisma.product.update({
    where: { id },
    data: { status, publishedAt: status === "published" ? new Date() : undefined },
  });
  await writeAudit({ userId: session.user.id, action: status === "published" ? "publish" : "archive", entityType: "Product", entityId: id, metadata: { status } });
  revalidatePath("/admin/products");
  revalidatePath("/san-pham");
}
