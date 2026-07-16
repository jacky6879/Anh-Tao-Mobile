import { prisma } from "@/lib/db";
import {
  PAGE_CONTENT_DEFAULTS,
  PAGE_CONTENT_FIELDS,
  type PageContent,
  type PageContentKey,
} from "@/lib/page-content-schema";

/**
 * Server-only helpers that read the editable landing-page content from the
 * database. The pure types/defaults live in `page-content-schema.ts` (no DB
 * import) so client components can share them safely.
 */

// Re-export the pure schema so existing server-side imports keep working.
export {
  PAGE_CONTENT_DEFAULTS,
  PAGE_CONTENT_FIELDS,
  PAGE_CONTENT_LABELS,
  pageContentSettingKey,
} from "@/lib/page-content-schema";
export type { PageContent, PageContentKey } from "@/lib/page-content-schema";

/**
 * Load the content for a single page, merging DB overrides on top of the
 * built-in defaults.
 */
export async function getPageContent(pageKey: PageContentKey): Promise<PageContent> {
  const defaults = PAGE_CONTENT_DEFAULTS[pageKey];
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: `content.${pageKey}.` } },
  });

  const content: PageContent = { ...defaults };
  for (const row of rows) {
    const field = row.key.split(".").pop() as keyof PageContent | undefined;
    if (field && PAGE_CONTENT_FIELDS.includes(field) && row.value != null && row.value !== "") {
      content[field] = row.value;
    }
  }
  return content;
}

/**
 * Load the content for every editable page. Used by the admin editor.
 */
export async function getAllPageContent(): Promise<Record<PageContentKey, PageContent>> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: "content." } },
  });

  const result = {} as Record<PageContentKey, PageContent>;
  for (const key of Object.keys(PAGE_CONTENT_DEFAULTS) as PageContentKey[]) {
    result[key] = { ...PAGE_CONTENT_DEFAULTS[key] };
  }

  for (const row of rows) {
    const parts = row.key.split(".");
    // content.<pageKey>.<field>
    if (parts.length !== 3) continue;
    const pageKey = parts[1] as PageContentKey;
    const field = parts[2] as keyof PageContent;
    if (
      result[pageKey] &&
      PAGE_CONTENT_FIELDS.includes(field) &&
      row.value != null &&
      row.value !== ""
    ) {
      result[pageKey][field] = row.value;
    }
  }

  return result;
}
