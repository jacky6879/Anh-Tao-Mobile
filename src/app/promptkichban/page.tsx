import Link from "next/link";
import { SeoLanding } from "@/components/SeoLanding";
import { PromptTool } from "@/components/PromptTool";

export const metadata = {
  title: "Prompt tạo kịch bản video bán iPhone cho Veo 3, Grok, Seedance",
  description:
    "Hướng dẫn viết prompt và kịch bản video short bán iPhone cho Veo 3, Grok, Seedance 2 và 2.5: cấu trúc 30 giây, góc máy, prompt chuyển động và một kịch bản mẫu dùng được ngay của Anh Táo Mobile.",
  keywords: [
    "prompt tạo video bán iPhone",
    "kịch bản video TikTok bán điện thoại",
    "prompt Veo 3 bán hàng",
    "prompt Seedance video ngắn",
    "kịch bản video iPhone cũ",
  ],
  alternates: { canonical: "/promptkichban" },
};

const faqs = [
  {
    q: "Prompt tạo kịch bản video gồm những gì?",
    a: "Một prompt tốt gồm bối cảnh, nhân vật, góc máy, chuyển động, giọng đọc, chữ trên màn hình và thời lượng từng cảnh, không chỉ một câu mô tả chung chung.",
  },
  {
    q: "Video short bán iPhone nên dài bao nhiêu?",
    a: "30 giây là độ dài dễ làm và dễ xem hết cho TikTok và Reels: 10 giây hook, 10 giây kiểm tra máy, 10 giây chốt và kêu gọi hành động.",
  },
  {
    q: "Có nên hứa bao đậu trong video bán hàng không?",
    a: "Không. Anh Táo Mobile tư vấn rõ trước, phù hợp rồi mới chốt, và nói rõ tình trạng máy cùng bảo hành, thay vì hứa chắc chắn một kết quả chưa xác nhận.",
  },
  {
    q: "Sau khi có prompt thì làm gì tiếp?",
    a: "Dán prompt vào Veo 3, Grok hoặc Seedance để tạo video, rồi kiểm tra lại mặt người dẫn, chữ trên màn hình và chuyển động trước khi đăng.",
  },
];

export default function Page() {
  return (
    <SeoLanding
      title="Anh Táo Mobile — tư vấn rõ trước, phù hợp rồi hẵng chốt"
      h1="Prompt tạo kịch bản video bán iPhone cho Veo 3, Grok, Seedance"
      description="Cách viết prompt và kịch bản video short bán iPhone: đủ hook, kiểm tra máy, chốt đơn, kèm góc máy và prompt chuyển động để dán thẳng vào Veo 3, Grok, Seedance 2 và Seedance 2.5."
      crumbs={[
        { href: "/", label: "Trang chủ" },
        { href: "/promptkichban", label: "Prompt kịch bản" },
      ]}
      body={
        <div>
          <PromptTool />
          <h2>Cấu trúc kịch bản video short 30 giây</h2>
          <p>
            Một video bán iPhone hiệu quả thường đi đúng 3 nhịp: gây chú ý,
            chứng minh máy tốt bằng cách kiểm tra thật, rồi chốt bằng một lời
            kêu gọi rõ ràng. Đừng nhồi quá nhiều thông số vào 30 giây, người
            xem sẽ không nhớ được gì.
          </p>
          <ul>
            <li>
              <strong>0–10 giây, hook:</strong> nói thẳng nỗi lo của người mua,
              ví dụ mua iPhone cũ sợ dính máy lỗi.
            </li>
            <li>
              <strong>10–20 giây, kiểm tra máy:</strong> màn hình và cảm ứng,
              Face ID, loa, mic, camera, pin và tình trạng máy.
            </li>
            <li>
              <strong>20–30 giây, chốt:</strong> nhắn tư vấn trước, phù hợp rồi
              hẵng qua xem máy, kèm tên shop và địa chỉ.
            </li>
          </ul>

          <h2>Prompt mẫu theo từng cảnh</h2>
          <p>
            Khi viết prompt cho công cụ tạo video, hãy ghi rõ tỉ lệ dọc 9:16,
            ánh sáng trong shop và chuyển động chậm, tập trung vào người dẫn.
          </p>
          <div className="surface-card p-6">
            <p>
              <strong>Cảnh 1, dolly chậm tiến vào:</strong>
            </p>
            <p>
              Slow cinematic dolly-in toward the presenter holding an iPhone
              in a bright phone shop, shallow depth of field, natural
              lighting, vertical 9:16.
            </p>
            <p>
              <strong>Cảnh 2, pan qua bàn máy rồi zoom nhẹ:</strong>
            </p>
            <p>
              Slow cinematic pan across iPhones on the shop table, then a
              gentle zoom on the presenter testing Face ID and speakers,
              steady handheld feel.
            </p>
            <p>
              <strong>Cảnh 3, zoom chậm ra:</strong>
            </p>
            <p>
              Slow zoom-out from the presenter to reveal the phone shop
              interior, warm natural light, clean composition.
            </p>
          </div>
          <p>
            Prompt gộp để dán vào model: Vertical 9:16 short tips video in a
            real Vietnamese phone shop. A friendly presenter checks a used
            iPhone: screen and touch, Face ID, speakers, camera and battery
            health. Slow cinematic dolly, pan and zoom, focused on the
            presenter, natural shop lighting.
          </p>
          <p>
            Negative prompt nên dùng kèm: distorted faces, extra fingers,
            garbled or misspelled on-screen text, guaranteed-approval wording,
            invented phone number or offer.
          </p>

          <h2>Kịch bản mẫu: 3 điều kiểm tra trước khi mua iPhone cũ</h2>
          <p>
            <strong>0–10 giây:</strong> Mua iPhone cũ mà sợ dính máy lỗi? Kiểm
            tra 3 chỗ này trước khi trả tiền. Một, màn hình và cảm ứng — vuốt,
            chạm đủ góc, xem có điểm chết hay ám màu không. Chữ trên màn hình:
            KIỂM TRA TRƯỚC KHI TRẢ TIỀN.
          </p>
          <p>
            <strong>10–20 giây:</strong> Hai, Face ID, loa, mic và camera — thử
            nhanh là biết. Ba, pin và tình trạng máy — hỏi rõ pin, đã thay gì
            chưa, và bảo hành bằng gì. Chữ trên màn hình: MÀN HÌNH — FACE ID —
            PIN.
          </p>
          <p>
            <strong>20–30 giây:</strong> Không rõ chỗ nào, cứ nhắn Anh Táo tư
            vấn trước, phù hợp rồi hẵng qua xem máy. Chữ cuối chia 2 dòng ngắn:
            ANH TÁO MOBILE, 1013 CMT8, P. Thủ Dầu Một, TP. Hồ Chí Minh.
          </p>

          <h2>Lỗi thường gặp khi tạo video bằng AI</h2>
          <ul>
            <li>Chữ trên màn hình bị sai chính tả hoặc quá dài ở cảnh cuối.</li>
            <li>Gương mặt người dẫn bị méo khi chuyển động nhanh.</li>
            <li>Hứa bao đậu hoặc đưa ưu đãi, số điện thoại chưa xác nhận.</li>
            <li>Nhồi quá nhiều ý vào một cảnh, giọng đọc không kịp thời lượng.</li>
          </ul>
          <p>
            Cách tránh đơn giản nhất: giữ mỗi cảnh một ý, chia chữ cuối thành
            2 dòng ngắn, và xem lại toàn bộ video trước khi đăng.
          </p>

          <h2>Xem thêm tại Anh Táo Mobile</h2>
          <ul>
            <li>
              <Link href="/thu-cu-doi-moi">Thu cũ đổi mới: gửi máy cũ, báo giá rõ ràng rồi trừ vào máy mới</Link>
            </li>
            <li>
              <Link href="/sua-chua">Sửa chữa iPhone lấy liền: thay pin, thay màn hình, ép kính</Link>
            </li>
            <li>
              <Link href="/iphone-cu">iPhone cũ đã kiểm tra kỹ tại Thủ Dầu Một</Link>
            </li>
            <li>
              <Link href="/lien-he">Liên hệ Anh Táo Mobile để được tư vấn trước</Link>
            </li>
          </ul>
        </div>
      }
      faqs={faqs}
      ctaHref="/thu-cu-doi-moi"
      ctaLabel="Thu cũ đổi mới ngay"
    />
  );
}
