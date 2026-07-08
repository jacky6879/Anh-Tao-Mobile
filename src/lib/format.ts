const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateTime = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateOnly = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "long",
});

export function formatVND(amount: number | null | undefined): string {
  if (amount == null) return "Liên hệ";
  return vnd.format(amount);
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatVND(min);
  return `${formatVND(min)} – ${formatVND(max)}`;
}

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateTime.format(new Date(d));
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateOnly.format(new Date(d));
}

export const CONDITION_LABELS: Record<string, string> = {
  new_seal: "New Seal",
  like_new: "Like New",
  percent99: "99%",
  used: "Đã dùng",
  light_scratch: "Trầy nhẹ",
  repaired: "Đã sửa chữa",
  unknown: "Không xác định",
};
