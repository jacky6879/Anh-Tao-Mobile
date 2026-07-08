import { env, hasResend } from "@/lib/env";

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Email sender. Uses Resend when configured; otherwise logs to console
 * (dev). Email failures never throw to the caller — return success flag.
 */
export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; id?: string }> {
  if (!hasResend) {
    console.log("[email:dev]", args.subject, "→", args.to);
    console.log(args.html.slice(0, 500));
    return { ok: true, id: "dev-mock" };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo ?? env.EMAIL_REPLY_TO,
    });
    if (error) throw error;
    return { ok: true, id: data?.id };
  } catch (e) {
    console.error("[email] send failed", e);
    return { ok: false };
  }
}

export function orderConfirmedHtml(opts: {
  publicCode: string;
  buyerName: string;
  total: number;
  memo?: string;
  qrUrl?: string;
}): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
    <h2>Anh Táo Mobile — Xác nhận đơn hàng ${opts.publicCode}</h2>
    <p>Chào ${opts.buyerName},</p>
    <p>Chúng tôi đã nhận được đơn đặt mua/giữ máy của bạn. Đơn đang chờ thanh toán.</p>
    ${opts.memo ? `<p><strong>Nội dung CK:</strong> ${opts.memo}</p>` : ""}
    <p><strong>Tổng tiền:</strong> ${opts.total.toLocaleString("vi-VN")}₫</p>
    ${opts.qrUrl ? `<img src="${opts.qrUrl}" alt="QR Sepay" width="240" />` : ""}
    <p>Sau khi thanh toán, nhân viên sẽ liên hệ xác nhận trong vòng 30 phút.</p>
    <p>Cảm ơn bạn đã tin tưởng Anh Táo Mobile.</p>
  </div>`;
}
