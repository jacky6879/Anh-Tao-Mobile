/**
 * Pure types, defaults and helpers for the editable landing-page content.
 *
 * This module intentionally contains NO database / Prisma imports so it can be
 * safely imported from client components (e.g. the admin editor form) without
 * pulling the Postgres driver into the browser bundle.
 *
 * Content is stored in the SiteSetting key-value table using the key pattern
 * `content.<pageKey>.<field>`. Defaults below are used whenever a field has
 * not been overridden in the admin panel, so the pages always render
 * meaningful text even on a fresh database.
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

export function pageContentSettingKey(pageKey: PageContentKey, field: keyof PageContent) {
  return `content.${pageKey}.${field}`;
}
