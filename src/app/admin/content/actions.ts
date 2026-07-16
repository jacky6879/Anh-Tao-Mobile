"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import {
  getAllPageContent,
  PAGE_CONTENT_DEFAULTS,
  PAGE_CONTENT_FIELDS,
  pageContentSettingKey,
  type PageContent,
  type PageContentKey,
} from "@/lib/page-content";

const PAGE_PATHS: Record<PageContentKey, string> = {
  "bao-hanh": "/bao-hanh",
  "thu-cu-doi-moi": "/thu-cu-doi-moi",
  "tra-gop": "/tra-gop",
};

export async function loadContent() {
  return getAllPageContent();
}

export async function savePageContent(
  pageKey: PageContentKey,
  content: PageContent
) {
  await requireAdmin();

  if (!PAGE_CONTENT_DEFAULTS[pageKey]) {
    throw new Error("Trang không hợp lệ");
  }

  const promises = PAGE_CONTENT_FIELDS.map((field) => {
    const value = (content[field] ?? "").toString();
    const key = pageContentSettingKey(pageKey, field);
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, description: `Nội dung trang ${pageKey} — ${field}` },
    });
  });

  await Promise.all(promises);

  const path = PAGE_PATHS[pageKey];
  if (path) revalidatePath(path);

  return { success: true };
}
