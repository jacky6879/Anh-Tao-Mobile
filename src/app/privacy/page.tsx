import { env } from "@/lib/env";

export const metadata = { title: "Chính sách bảo mật", description: "Chính sách bảo mật thông tin khách hàng theo Nghị định 13/2023/NĐ-CP.", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 prose dark:prose-invert">
      <h1>Chính sách bảo mật</h1>
      <p>Anh Táo Mobile ({env.NEXT_PUBLIC_BUSINESS_NAME}) cam kết bảo vệ thông tin cá nhân của khách hàng theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</p>

      <h2>1. Thông tin thu thập</h2>
      <ul>
        <li>Họ tên, email, số điện thoại, địa chỉ (khi đặt mua/đặt lịch/đặt thu cũ)</li>
        <li>Lịch sử đơn hàng, đặt lịch sửa chữa, yêu cầu thu cũ</li>
        <li>Địa chỉ IP (đã băm hash) cho mục đích chống lạm dụng</li>
        <li>Nội dung chuyển khoản Sepay (để đối soát đơn)</li>
      </ul>

      <h2>2. Mục đích sử dụng</h2>
      <ul>
        <li>Xử lý đơn hàng, đặt lịch, yêu cầu thu cũ</li>
        <li>Liên hệ xác nhận, hỗ trợ sau bán</li>
        <li>Thống kê nội bộ, chống gian lận</li>
      </ul>

      <h2>3. Bên thứ ba</h2>
      <p>Chúng tôi chỉ chia sẻ dữ liệu tối thiểu cần thiết với: Google (đăng nhập), Resend (gửi email), Sepay (đối soát thanh toán), Supabase (lưu trữ), Vercel (hosting), Sentry (theo dõi lỗi).</p>

      <h2>4. Quyền của bạn</h2>
      <ul>
        <li>Truy cập, chỉnh sửa thông tin cá nhân tại mục Tài khoản</li>
        <li>Xuất dữ liệu cá nhân (JSON) và xoá tài khoản tại /dashboard/settings</li>
        <li>Liên hệ DPO: {env.NEXT_PUBLIC_CONTACT_EMAIL}</li>
      </ul>

      <h2>5. Thời gian lưu</h2>
      <p>Dữ liệu giao dịch được lưu trong thời hạn pháp lý yêu cầu. Khi bạn xoá tài khoản, thông tin cá nhân được ẩn danh nhưng doanh số giao dịch được giữ cho mục đích kế toán.</p>
    </div>
  );
}
