export const metadata = { title: "Chính sách bảo hành chi tiết", alternates: { canonical: "/warranty-policy" } };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 prose dark:prose-invert">
      <h1>Chính sách bảo hành</h1>
      <h2>Máy cũ</h2>
      <ul>
        <li>Bảo hành phần cứng 3–12 tháng tuỳ dòng máy (ghi trên trang sản phẩm)</li>
        <li>Bảo hành lỗi phần cứng do nhà sản xuất</li>
        <li>Không bảo hành: rơi vỡ, vào nước, can thiệp bên ngoài, lỗi phần mềm do người dùng</li>
      </ul>
      <h2>Dịch vụ sửa chữa</h2>
      <ul>
        <li>Linh kiện thay có bảo hành riêng (thường 3–6 tháng)</li>
        <li>Đem theo phiếu bảo hành / mã đơn để được hỗ trợ</li>
      </ul>
      <h2>Quy trình</h2>
      <p>Liên hệ shop, mang máy và phiếu đến kiểm tra. Nếu thuộc diện bảo hành, sửa/ch thay miễn phí trong thời gian cam kết.</p>
    </div>
  );
}
