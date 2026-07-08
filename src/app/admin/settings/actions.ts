"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    if (s.value) map[s.key] = s.value;
  }
  return map;
}

export async function saveSettings(data: Record<string, string>) {
  await requireAdmin();

  const promises = Object.entries(data).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );

  await Promise.all(promises);
  
  
  revalidatePath("/", "layout");
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  
  return { success: true };
}
