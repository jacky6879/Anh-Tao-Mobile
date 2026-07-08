"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/schemas";
import { slugify, uniqueSlug, slugExistsCategory } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";

export async function createCategory(formData: FormData) {
  const session = await requireAdmin();
  const parsed = categorySchema.parse(Object.fromEntries(formData.entries()));
  const slug = parsed.slug ? slugify(parsed.slug) : await uniqueSlug(parsed.name, slugExistsCategory);
  const cat = await prisma.category.create({
    data: { name: parsed.name, slug, description: parsed.description, icon: parsed.icon, order: parsed.order, parentId: parsed.parentId || null },
  });
  await writeAudit({ userId: session.user.id, action: "create", entityType: "Category", entityId: cat.id, metadata: { slug } });
  revalidatePath("/admin/categories");
  await setFlash({ type: "success", message: "Đã tạo danh mục" });
}

export async function deleteCategory(id: string) {
  const session = await requireAdmin();
  await prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  await writeAudit({ userId: session.user.id, action: "delete", entityType: "Category", entityId: id, metadata: {} });
  revalidatePath("/admin/categories");
  await setFlash({ type: "success", message: "Đã xoá danh mục" });
}
