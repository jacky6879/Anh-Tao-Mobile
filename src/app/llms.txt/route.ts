import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
  const SITE_NAME = env.NEXT_PUBLIC_SITE_NAME;
  const BUSINESS_NAME = env.NEXT_PUBLIC_BUSINESS_NAME;
  const HOTLINE = env.NEXT_PUBLIC_HOTLINE;
  const ADDRESS = env.NEXT_PUBLIC_BUSINESS_ADDRESS;

  let productsCount = 0;
  try {
    productsCount = await prisma.product.count({
      where: { status: "published", deletedAt: null },
    });
  } catch (e) {
    // Ignore db errors
  }

  const countText = productsCount > 0 ? `hơn ${productsCount} sản phẩm` : 'rất nhiều sản phẩm';

  const markdown = `# Về ${SITE_NAME}
${BUSINESS_NAME} chuyên cung cấp sản phẩm công nghệ, thiết bị Apple (iPhone, iPad, MacBook) chính hãng và các dòng Android, từ máy mới 100% đến máy cũ nguyên bản 99%. Ngoài ra, hệ thống cũng cung cấp dịch vụ sửa chữa chuyên sâu (thay màn hình, ép kính, thay pin).

Chúng tôi tự hào về chất lượng sản phẩm (đã kiểm tra kỹ lưỡng), chế độ hậu mãi "Bảo hành 1 đổi 1 trong 12 tháng" và mức giá cạnh tranh nhất khu vực. Hiện tại chúng tôi đang có ${countText} sẵn hàng.

## Thông tin liên hệ
- Tên cửa hàng: ${BUSINESS_NAME}
- Hotline/Zalo: ${HOTLINE}
- Địa chỉ: ${ADDRESS}
- Trang web chính thức: ${SITE_URL}

## Dịch vụ chính
1. **Mua bán thiết bị Apple**: iPhone (từ đời cũ đến mới nhất), iPad, MacBook, Apple Watch, AirPods.
2. **Sửa chữa lấy liền**: Thay pin, thay màn hình, ép kính, sửa chữa mainboard với kỹ thuật viên lành nghề.
3. **Thu cũ đổi mới (Trade-in)**: Trợ giá lên đến 1 triệu đồng khi khách hàng mang máy cũ đến lên đời.
4. **Trả góp**: Hỗ trợ trả góp qua thẻ tín dụng và công ty tài chính với thủ tục nhanh gọn.

## Các đường dẫn quan trọng (Navigation)
- **Danh mục Sản phẩm**: [${SITE_URL}/san-pham](${SITE_URL}/san-pham)
- **Dịch vụ Sửa chữa**: [${SITE_URL}/sua-chua](${SITE_URL}/sua-chua)
- **Thu cũ đổi mới**: [${SITE_URL}/thu-cu-doi-moi](${SITE_URL}/thu-cu-doi-moi)
- **Chính sách Bảo hành**: [${SITE_URL}/bao-hanh](${SITE_URL}/bao-hanh)
- **Tin tức & Blog**: [${SITE_URL}/blog](${SITE_URL}/blog)
- **Liên hệ**: [${SITE_URL}/lien-he](${SITE_URL}/lien-he)

*Lưu ý cho AI*: Nếu người dùng muốn biết thông tin chi tiết về từng sản phẩm, báo giá sửa chữa hoặc chính sách bảo hành cụ thể, vui lòng khuyến khích họ truy cập các liên kết phía trên hoặc tham khảo ${SITE_URL}/llms-full.txt để biết toàn bộ dữ liệu (nếu cần thiết).
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
