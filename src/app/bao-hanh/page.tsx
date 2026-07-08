import { SeoLanding } from "@/components/SeoLanding";

export const metadata = { title: "Bảo hành — Anh Táo Mobile", description: "Chính sách bảo hành máy cũ và dịch vụ sửa chữa tại Anh Táo Mobile. Rõ ràng, minh bạch.", alternates: { canonical: "/bao-hanh" } };

export default function Page() {
  return (
    <SeoLanding
      title="Chính sách bảo hành"
      h1="Bảo hành rõ ràng — yên tâm sử dụng"
      description="Mỗi máy và mỗi dịch vụ đều có thông tin bảo hành ghi rõ. Cam kết minh bạch."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/bao-hanh", label: "Bảo hành" }]}
      body={
        <>
          <h2>Máy cũ</h2>
          <p>Máy cũ được bảo hành phần cứng từ 3–12 tháng tuỳ dòng máy, ghi rõ trên trang sản phẩm. Bảo hành bao gồm lỗi phần cứng do nhà sản xuất, không bao gồm rơi vỡ, vào nước, hoặc can thiệp bên ngoài.</p>
          <h2>Dịch vụ sửa chữa</h2>
          <p>Mỗi dịch vụ thay linh kiện có thời gian bảo hành riêng (thường 3–6 tháng) cho linh kiện được thay.</p>
          <h2>Đổi trả</h2>
          <p>Máy cũ được đổi trong 3 ngày nếu phát hiện lỗi phần cứng không thông báo trước. Xem chi tiết tại chính sách đổi trả.</p>
        </>
      }
      ctaHref="/san-pham"
      ctaLabel="Xem máy đang bán"
    />
  );
}
