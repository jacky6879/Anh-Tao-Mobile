"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveBlog(id: string, data: any) {
  await requireAdmin();
  if (id === "new") {
    await prisma.seoPage.create({ data });
  } else {
    await prisma.seoPage.update({ where: { id }, data });
  }
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function deleteBlog(id: string) {
  await requireAdmin();
  await prisma.seoPage.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}
