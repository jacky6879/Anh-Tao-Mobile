import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
  const SITE_NAME = env.NEXT_PUBLIC_SITE_NAME;
  const BUSINESS_NAME = env.NEXT_PUBLIC_BUSINESS_NAME;

  let products: any[] = [];
  let services: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { status: "published", deletedAt: null },
      select: { title: true, price: true, slug: true, condition: true, stock: true },
      take: 50,
      orderBy: { createdAt: "desc" },
    });
    services = await prisma.repairService.findMany({
      where: { status: "published", deletedAt: null },
      select: { title: true, priceMin: true, slug: true, estimatedTime: true },
      take: 20,
    });
  } catch (e) {
    // Ignore db errors
  }

  const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const productList = products.map((p) => `- [${p.title}](${SITE_URL}/san-pham/${p.slug}): ${formatPrice(p.price)} (Tình trạng: ${p.condition}, Tồn kho: ${p.stock > 0 ? "Còn hàng" : "Hết hàng"})`).join("\n");
  const serviceList = services.map((s) => `- [${s.title}](${SITE_URL}/sua-chua/${s.slug}): ${formatPrice(s.priceMin)} (Thời gian sửa: ${s.estimatedTime || "liên hệ"})`).join("\n");

  const markdown = `# ${SITE_NAME} - Cơ sở dữ liệu toàn diện (Full Knowledge Base)

Tài liệu này cung cấp toàn bộ thông tin chi tiết về các sản phẩm nổi bật, dịch vụ, và chính sách tại ${BUSINESS_NAME}, phục vụ cho các AI Bot trong việc tư vấn khách hàng.

## 1. Giới thiệu chung
${BUSINESS_NAME} chuyên cung cấp sản phẩm công nghệ, thiết bị Apple (iPhone, iPad, MacBook) chính hãng và các dòng Android, từ máy mới 100% đến máy cũ nguyên bản 99%. Ngoài ra, hệ thống cũng cung cấp dịch vụ sửa chữa chuyên sâu (thay màn hình, ép kính, thay pin).

## 2. Chính sách Bảo Hành & Đổi Trả (Cực kỳ quan trọng)
- **Bảo hành tiêu chuẩn**: 12 tháng bảo hành toàn diện.
- **Bảo hành 1 đổi 1**: Trong suốt 12 tháng (nếu lỗi do nhà sản xuất).
- **Hỗ trợ phần mềm**: Miễn phí trọn đời máy.
- **Pin**: Hỗ trợ thay pin miễn phí trong thời gian đầu (tuỳ dòng máy).
- *Lưu ý*: Máy rơi vỡ, vô nước, cấn móp, mất tem bảo hành sẽ bị từ chối bảo hành hoặc chuyển sang sửa chữa tính phí hỗ trợ.

## 3. Thu cũ đổi mới (Trade-in)
- Nhận thu lại tất cả các dòng máy từ iPhone, iPad, điện thoại Android, laptop...
- Giá thu cực kỳ sát giá thị trường.
- Trợ giá thêm lên đến **1.000.000 VNĐ** khi khách hàng chọn mua máy mới tại cửa hàng.

## 4. Dịch vụ Sửa chữa tiêu biểu
Dưới đây là một số dịch vụ sửa chữa đang cung cấp:
${serviceList || "- (Hiện chưa có dữ liệu dịch vụ)"}

*Quy trình sửa chữa minh bạch, khách hàng xem trực tiếp và lấy ngay trong ngày.*

## 5. Danh sách Sản phẩm nổi bật (Top 50)
${productList || "- (Hiện chưa có dữ liệu sản phẩm)"}

## 6. Hỗ trợ khách hàng
- Cần báo giá chính xác, vui lòng gọi Hotline: ${env.NEXT_PUBLIC_HOTLINE}
- Tư vấn Zalo: ${env.NEXT_PUBLIC_ZALO}
- Địa chỉ: ${env.NEXT_PUBLIC_BUSINESS_ADDRESS}
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
