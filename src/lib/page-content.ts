import { prisma } from "@/lib/db";

/**
 * Editable content for the static landing pages
 * (Bảo hành, Thu cũ đổi mới, Trả góp...).
 *
 * Content is stored in the SiteSetting key-value table using the key
 * pattern `content.<pageKey>.<field>`. Defaults below are used whenever a
 * field has not been overridden in the admin panel, so the pages always
 * render meaningful text even on a fresh database.
 */

export type PageContent = {
  h1: string;
  /** Short intro line shown under the H1. */
  intro: string;
  /** Rich body content stored as HTML. */
  bodyHtml: string;
  /** Title shown on the bottom CTA card. */
  ctaTitle: string;
};

export type PageContentKey = "bao-hanh" | "thu-cu-doi-moi" | "tra-gop";

export const PAGE_CONTENT_DEFAULTS: Record<PageContentKey, PageContent> = {
  "bao-hanh": {
    h1: "Bảo hành rõ ràng — yên tâm sử dụng",
    intro: "Mỗi máy và mỗi dịch vụ đều có thông tin bảo hành ghi rõ. Cam kết minh bạch.",
    bodyHtml: [
      "<h2>Máy cũ</h2>",
      "<p>Máy cũ được bảo hành phần cứng từ 3–12 tháng tuỳ dòng máy, ghi rõ trên trang sản phẩm. Bảo hành bao gồm lỗi phần cứng do nhà sản xuất, không bao gồm rơi vỡ, vào nước, hoặc can thiệp bên ngoài.</p>",
      "<h2>Dịch vụ sửa chữa</h2>",
      "<p>Mỗi dịch vụ thay linh kiện có thời gian bảo hành riêng (thường 3–6 tháng) cho linh kiện được thay.</p>",
      "<h2>Đổi trả</h2>",
      "<p>Máy cũ được đổi trong 3 ngày nếu phát hiện lỗi phần cứng không thông báo trước. Xem chi tiết tại chính sách đổi trả.</p>",
    ].join("\n"),
    ctaTitle: "Chính sách bảo hành",
  },
  "thu-cu-doi-moi": {
    h1: "Thu cũ đổi mới — lên đời iPhone mới giá tốt",
    intro: "Gửi thông tin máy cũ, Anh Táo Mobile báo giá thu mua minh bạch rồi trừ vào máy mới.",
    bodyHtml: [
      "<p>Lên đời iPhone mới chưa bao giờ dễ hơn. Anh Táo Mobile hỗ trợ thu mua máy cũ — iPhone, iPad, MacBook — với quy trình rõ ràng:</p>",
      "<ul>",
      "<li>Bạn gửi thông tin máy qua form</li>",
      "<li>Shop báo giá thu cũ trong 30 phút</li>",
      "<li>Đồng ý → mang máy tới shop kiểm tra nhanh, trừ tiền vào máy mới</li>",
      "</ul>",
      "<p>Máy được kiểm tra công khai, báo giá thật — không ép giá, không nói quá.</p>",
    ].join("\n"),
    ctaTitle: "Thu cũ đổi mới tại Anh Táo Mobile",
  },
  "tra-gop": {
    h1: "Trả góp iPhone, iPad, MacBook",
    intro: "Hỗ trợ trả góp qua ngân hàng và công ty tài chính — chỉ cần CCCD, duyệt nhanh.",
    bodyHtml: [
      "<p>Với các sản phẩm được bật tuỳ chọn trả góp, Anh Táo Mobile hỗ trợ:</p>",
      "<ul>",
      "<li>Trả góp qua thẻ tín dụng (0% lãi suất với một số ngân hàng)</li>",
      "<li>Trả góp qua công ty tài chính (Home Credit, FE Credit...)</li>",
      "<li>Chỉ cần CCCD, duyệt hồ sơ trong 15–30 phút</li>",
      "</ul>",
      "<p>Liên hệ shop để biết máy nào đang hỗ trợ trả góp và điều kiện cụ thể.</p>",
    ].join("\n"),
    ctaTitle: "Trả góp tại Anh Táo Mobile",
  },
};

export const PAGE_CONTENT_FIELDS: (keyof PageContent)[] = [
  "h1",
  "intro",
  "bodyHtml",
  "ctaTitle",
];

export const PAGE_CONTENT_LABELS: Record<PageContentKey, string> = {
  "bao-hanh": "Bảo hành",
  "thu-cu-doi-moi": "Thu cũ đổi mới",
  "tra-gop": "Trả góp",
};

function settingKey(pageKey: PageContentKey, field: keyof PageContent) {
  return `content.${pageKey}.${field}`;
}

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

export { settingKey as pageContentSettingKey };
