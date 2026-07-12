import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const SECRET = process.env.SEED_SECRET || "anh-tao-seed-blog-2026";

const BLOG_BODY = `<!-- ========== SCHEMA JSON-LD ========== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
      "description": "Mua iPhone cũ cần kiểm tra gì? Xem ngay checklist 10 bước kiểm tra iPhone cũ từ A-Z: màn hình, pin, Face ID, camera, loa. Cập nhật 2026.",
      "image": "https://anhtaomobile.com/wp-content/uploads/2026/07/checklist-mua-iphone-cu.jpg",
      "datePublished": "2026-07-12",
      "dateModified": "2026-07-12",
      "author": { "@type": "Person", "name": "Anh Táo", "url": "https://anhtaomobile.com" },
      "publisher": {
        "@type": "Organization",
        "name": "Anh Táo Mobile",
        "url": "https://anhtaomobile.com",
        "logo": { "@type": "ImageObject", "url": "https://anhtaomobile.com/wp-content/uploads/2026/07/logo-anh-tao.png" },
        "address": { "@type": "PostalAddress", "streetAddress": "1013 Cách Mạng Tháng 8", "addressLocality": "Thủ Dầu Một", "addressRegion": "Bình Dương", "addressCountry": "VN" },
        "telephone": "0819000011"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Mua iPhone cũ nên kiểm tra gì đầu tiên?", "acceptedAnswer": { "@type": "Answer", "text": "Điều đầu tiên cần kiểm tra là ngoại hình máy (khung, màn hình, ốc vít) và màn hình xem có bị thay chưa. Sau đó kiểm tra Face ID/Touch ID, pin, camera, loa, mic. Cuối cùng kiểm tra IMEI để xác nhận máy không bị khóa iCloud, không phải máy lock." } },
        { "@type": "Question", "name": "Pin iPhone cũ bao nhiêu phần trăm là tốt?", "acceptedAnswer": { "@type": "Answer", "text": "Pin iPhone cũ từ 85% trở lên được coi là tốt, dùng được 1-2 năm trước khi cần thay. Pin dưới 80% là yếu, nên thay pin mới ngay. Chi phí thay pin iPhone tại Anh Táo Mobile từ 350.000đ đến 700.000đ tùy dòng máy, lấy liền 45 phút." } },
        { "@type": "Question", "name": "Làm sao biết iPhone cũ có bị thay màn hình chưa?", "acceptedAnswer": { "@type": "Answer", "text": "Có 3 cách: (1) So màu viền màn hình trong tối — màn zin viền đen tuyền; (2) Soi dưới ánh sáng mạnh — màn zin phản chiếu đều; (3) Vào Cài đặt > Cài đặt chung > Giới thiệu — nếu có cảnh báo là đã thay." } },
        { "@type": "Question", "name": "Mua iPhone cũ ở đâu uy tín tại Bình Dương?", "acceptedAnswer": { "@type": "Answer", "text": "Anh Táo Mobile tại 1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương là địa chỉ chuyên iPhone cũ uy tín. Cam kết máy đẹp, kiểm tra kỹ, bảo hành main 12 tháng 1 đổi 1, pin 60 tháng." } }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://anhtaomobile.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://anhtaomobile.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "Cách Mua iPhone Cũ Không Bị Lỗi", "item": "https://anhtaomobile.com/blog/cach-mua-iphone-cu-khong-bi-loi" }
      ]
    }
  ]
}
</script>

<article class="blog-post-content">

  <p><strong>Mua iPhone cũ là cách tiết kiệm 30-50% so với mua mới, nhưng nếu không biết kiểm tra, bạn dễ "tiền mất tật mang" với máy lỗi, máy thay linh kiện dỏm, thậm chí máy mất trộm bị khóa iCloud.</strong></p>
  <p>Với hơn 5 năm kinh nghiệm trong nghề mua bán — sửa chữa iPhone, Anh Táo Mobile tổng hợp cho bạn <strong>checklist 10 bước kiểm tra iPhone cũ từ A-Z</strong>. Dù bạn mua ở đâu, làm theo checklist này sẽ giúp bạn tránh 90% rủi ro thường gặp.</p>

  <div class="toc"><h2>Nội dung chính</h2><ol><li><a href="#buoc-1">Bước 1: Kiểm tra ngoại hình</a></li><li><a href="#buoc-2">Bước 2: Kiểm tra màn hình</a></li><li><a href="#buoc-3">Bước 3: Kiểm tra Face ID / Touch ID</a></li><li><a href="#buoc-4">Bước 4: Kiểm tra pin</a></li><li><a href="#buoc-5">Bước 5: Kiểm tra IMEI & khóa</a></li><li><a href="#buoc-6">Bước 6: Kiểm tra camera</a></li><li><a href="#buoc-7">Bước 7: Kiểm tra loa, mic, rung</a></li><li><a href="#buoc-8">Bước 8: Kiểm tra cảm biến & cổng sạc</a></li><li><a href="#buoc-9">Bước 9: Kiểm tra mainboard</a></li><li><a href="#buoc-10">Bước 10: Kiểm tra phụ kiện</a></li></ol></div>

  <h2 id="buoc-1">Bước 1: Kiểm tra ngoại hình — khung, màn hình, ốc vít</h2>
  <p>Ngoại hình là thứ dễ kiểm tra nhất nhưng cũng dễ bị bỏ qua nhất vì tâm lý "máy cũ thì phải trầy".</p>
  <h3>Những điểm cần kiểm tra:</h3>
  <ul>
    <li><strong>Khung viền:</strong> Xem có móp, cong không. Máy cong nhẹ có thể làm hở màn hình, vào nước sau này.</li>
    <li><strong>Ốc vít dưới chân sạc:</strong> Ốc còn nguyên, không trầy xước, không bị "đóng lại" là dấu hiệu máy chưa từng mở ra.</li>
    <li><strong>Mặt lưng kính:</strong> Nứt nhỏ cũng làm mất khả năng chống nước.</li>
    <li><strong>Nút bấm:</strong> Nút nguồn, nút âm lượng, nút gạt rung — tất cả phải bấm nảy.</li>
  </ul>

  <h2 id="buoc-2">Bước 2: Kiểm tra màn hình — zin hay đã thay?</h2>
  <p>Đây là bước quan trọng nhất. Màn hình là linh kiện đắt nhất trên iPhone (chiếm 30-40% giá máy).</p>
  <table><thead><tr><th>Cách kiểm tra</th><th>Màn hình Zin</th><th>Màn hình đã thay</th></tr></thead><tbody>
    <tr><td>So màu viền đen — tắt màn hình, nhìn trong bóng tối</td><td>Viền đen tuyền</td><td>Viền hơi xám</td></tr>
    <tr><td>Soi dưới ánh sáng mạnh</td><td>Phản chiếu đều</td><td>Gợn sóng</td></tr>
    <tr><td>Kiểm tra thông báo linh kiện</td><td>Không có cảnh báo</td><td>Hiện "Không xác định được linh kiện"</td></tr>
  </tbody></table>
  <p>⚠️ Từ iPhone 12 trở lên, Apple ép buộc ghép cặp linh kiện. Nếu màn hình bị thay mà không được ghép cặp, máy sẽ hiện cảnh báo.</p>
  <p>👉 Nếu bạn ở <strong>Bình Dương</strong>, mang máy đến Anh Táo Mobile để được kiểm tra màn hình miễn phí.</p>

  <h2 id="buoc-3">Bước 3: Kiểm tra Face ID / Touch ID</h2>
  <p>Face ID và Touch ID cực kỳ quan trọng — nếu hỏng thì <strong>gần như không sửa được</strong>.</p>
  <ol><li>Vào Cài đặt → Face ID & Mật mã</li><li>Thiết lập khuôn mặt hoặc vân tay mới</li><li>Khóa máy và mở bằng Face ID — phải hoạt động nhanh, mượt</li></ol>
  <p>⚠️ Nếu máy báo "Không thể kích hoạt Face ID", tuyệt đối <strong>không mua</strong>.</p>

  <h2 id="buoc-4">Bước 4: Kiểm tra pin iPhone cũ</h2>
  <p>Pin là linh kiện hao mòn tự nhiên và là yếu tố quyết định trải nghiệm hàng ngày.</p>
  <ul>
    <li><strong>Trên 85%:</strong> Pin còn tốt, dùng 1-2 năm</li>
    <li><strong>80-85%:</strong> Pin trung bình</li>
    <li><strong>Dưới 80%:</strong> Pin yếu, nên thay ngay</li>
  </ul>
  <p>🔋 <strong>Bảng giá thay pin tại Anh Táo Mobile:</strong></p>
  <table><thead><tr><th>Dòng máy</th><th>Loại pin</th><th>Giá</th><th>Thời gian</th></tr></thead><tbody>
    <tr><td>iPhone 8 Plus / X</td><td>Pin Pisen</td><td>350.000đ</td><td>30-45 phút</td></tr>
    <tr><td>iPhone XS Max / 11 Series</td><td>Pin Pisen</td><td>450.000đ</td><td>45 phút</td></tr>
    <tr><td>iPhone 12 Series</td><td>Pin Pisen</td><td>550.000đ</td><td>45-60 phút</td></tr>
    <tr><td>iPhone 13 Series</td><td>Pin Pisen</td><td>600.000đ</td><td>45-60 phút</td></tr>
    <tr><td>iPhone 14 Series</td><td>Pin Pisen</td><td>700.000đ</td><td>45-60 phút</td></tr>
    <tr><td>iPhone 15 Series</td><td>Pin OEM</td><td>800.000đ</td><td>60 phút</td></tr>
  </tbody></table>

  <h2 id="buoc-5">Bước 5: Kiểm tra IMEI và tình trạng khóa</h2>
  <p>Đây là bước bắt buộc. Mua phải máy khóa iCloud là mất trắng tiền.</p>
  <ol><li>Vào Cài đặt → Cài đặt chung → Giới thiệu → xem IMEI</li><li>So sánh IMEI trên máy với IMEI trên khay SIM</li><li>Kiểm tra tại <a href="https://imei.info" target="_blank" rel="nofollow noopener">imei.info</a></li></ol>
  <p>🚫 <strong>Tuyệt đối không mua nếu:</strong> máy còn tài khoản iCloud, Find My iPhone đang ON.</p>

  <h2 id="buoc-6">Bước 6: Kiểm tra camera trước & sau</h2>
  <p>Camera iPhone rất đắt — riêng cụm camera sau 14 Pro Max giá thay thế lên đến 2-3 triệu.</p>
  <ul>
    <li><strong>Camera sau:</strong> Chụp ảnh tất cả chế độ: 0.5x, 1x, 2x/3x/5x</li>
    <li><strong>Camera trước:</strong> Chụp selfie, kiểm tra chân dung</li>
    <li><strong>Quay video:</strong> Quay 4K 60fps trong 1 phút</li>
  </ul>

  <h2 id="buoc-7">Bước 7: Kiểm tra loa, micro, rung</h2>
  <ul>
    <li><strong>Loa ngoài:</strong> Mở YouTube, chỉnh volume max</li>
    <li><strong>Loa trong:</strong> Gọi cho số bất kỳ, áp tai nghe</li>
    <li><strong>Micro:</strong> Ghi âm Voice Memos, nói rồi nghe lại</li>
    <li><strong>Rung:</strong> Gạt nút rung vài lần</li>
  </ul>

  <h2 id="buoc-8">Bước 8: Kiểm tra cảm biến & cổng sạc</h2>
  <ul>
    <li><strong>Cảm biến tiệm cận:</strong> Gọi điện, che phần trên màn hình</li>
    <li><strong>Cảm biến ánh sáng:</strong> Bật Auto-Brightness</li>
    <li><strong>Con quay:</strong> Mở ứng dụng Compass</li>
    <li><strong>Wifi & Bluetooth:</strong> Kết nối Wifi, bắt tay Bluetooth</li>
    <li><strong>Cổng sạc:</strong> Cắm sạc, lắc nhẹ dây</li>
  </ul>

  <h2 id="buoc-9">Bước 9: Kiểm tra mainboard — bài test nặng</h2>
  <p>Mainboard là "trái tim" của iPhone.</p>
  <ol>
    <li><strong>Test nặng:</strong> Mở cùng lúc 5-6 ứng dụng, quay 4K 60fps trong 5 phút</li>
    <li><strong>Test pin ảo:</strong> Dùng đến khi pin còn 5-10% — không được sập nguồn</li>
    <li><strong>Kiểm tra lịch sử khởi động lại:</strong> Tìm file "panic-full" hoặc "ResetCounter"</li>
  </ol>

  <h2 id="buoc-10">Bước 10: Kiểm tra phụ kiện đi kèm & giấy tờ</h2>
  <ul>
    <li><strong>Hộp:</strong> Nếu có hộp zin, IMEI trên hộp khớp với máy</li>
    <li><strong>Sạc & cáp:</strong> Nên là phụ kiện chính hãng hoặc thương hiệu uy tín</li>
    <li><strong>Hóa đơn:</strong> Cửa hàng uy tín luôn xuất hóa đơn rõ ràng</li>
  </ul>

  <h2>Mua iPhone cũ ở đâu: Tiệm hay Online?</h2>
  <table><thead><tr><th>Tiêu chí</th><th>Mua tại cửa hàng</th><th>Mua online</th></tr></thead><tbody>
    <tr><td>Được kiểm tra máy trực tiếp</td><td>✅ Có</td><td>❌ Không</td></tr>
    <tr><td>Bảo hành</td><td>✅ Rõ ràng</td><td>⚠️ Thường 1 tuần</td></tr>
    <tr><td>Giá</td><td>Cao hơn 5-10%</td><td>Rẻ hơn, rủi ro cao</td></tr>
    <tr><td>Rủi ro máy lock</td><td>✅ Rất thấp</td><td>❌ Cao</td></tr>
    <tr><td>Hỗ trợ sau mua</td><td>✅ Có nơi quay lại</td><td>❌ Người bán "mất tích"</td></tr>
  </tbody></table>

  <h2>Câu hỏi thường gặp</h2>
  <h3>Mua iPhone cũ nên kiểm tra gì đầu tiên?</h3>
  <p>Kiểm tra ngoại hình máy và màn hình trước. Sau đó Face ID, pin, camera, loa, mic. Cuối cùng kiểm tra IMEI.</p>
  <h3>Pin iPhone cũ bao nhiêu phần trăm là tốt?</h3>
  <p>Từ 85% trở lên là tốt. Dưới 80% nên thay pin mới. Chi phí từ 350.000đ đến 700.000đ tại Anh Táo Mobile.</p>
  <h3>Làm sao biết iPhone cũ có bị thay màn hình chưa?</h3>
  <p>So màu viền trong tối, soi dưới ánh sáng mạnh, kiểm tra thông báo linh kiện trong Cài đặt.</p>
  <h3>Mua iPhone cũ ở đâu uy tín tại Bình Dương?</h3>
  <p>Anh Táo Mobile tại 1013 CMT8, Thủ Dầu Một. BH main 12 tháng 1 đổi 1, pin 60 tháng.</p>
  <h3>Có nên mua iPhone cũ đã qua sửa chữa không?</h3>
  <p>Nếu chỉ thay pin hoặc ép kính thì vẫn nên mua. Nếu thay màn hình, thay main — cần kiểm tra kỹ và mua nơi có bảo hành.</p>

  <div class="cta-box">
    <h2>Mua iPhone cũ tại Anh Táo Mobile — kiểm tra miễn phí, bảo hành rõ ràng</h2>
    <p>Nếu bạn không muốn tự kiểm tra từng bước như trên, hãy đến Anh Táo Mobile.</p>
    <ul>
      <li>✅ Máy được kiểm tra 10 bước trước khi bán</li>
      <li>✅ Bảo hành main 12 tháng — 1 đổi 1</li>
      <li>✅ Bảo hành pin 60 tháng</li>
      <li>✅ <a href="https://anhtaomobile.com/thu-cu-doi-moi/">Thu cũ đổi mới</a></li>
      <li>✅ <a href="https://anhtaomobile.com/tra-gop/">Trả góp 0%</a></li>
      <li>✅ <a href="https://anhtaomobile.com/sua-chua/">Sửa chữa lấy liền</a></li>
    </ul>
    <p>📍 <strong>1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương</strong></p>
    <p>📞 <a href="tel:0819000011">0819.000.011</a> | 🕗 8h30 - 21h</p>
    <p>🌐 <a href="https://anhtaomobile.com">anhtaomobile.com</a></p>
    <a href="https://anhtaomobile.com/san-pham/">Xem máy đang bán →</a>
    <a href="https://anhtaomobile.com/sua-chua/">Đặt lịch sửa chữa →</a>
  </div>

  <div class="author-box">
    <p><strong>Bài viết bởi:</strong> Anh Táo — Founder Anh Táo Mobile. Hơn 5 năm kinh nghiệm mua bán và sửa chữa iPhone.</p>
    <p><em>Cập nhật: 12/07/2026</em></p>
  </div>

</article>`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.seoPage.upsert({
      where: { slug: "cach-mua-iphone-cu-khong-bi-loi" },
      update: {
        title: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
        h1: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
        body: BLOG_BODY,
        metaTitle: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
        metaDescription: "Mua iPhone cũ cần kiểm tra gì? Checklist 10 bước từ A-Z: màn hình, pin, Face ID, IMEI, camera. Anh Táo Mobile Bình Dương — máy đẹp, bảo hành rõ ràng.",
        ogImage: "https://anhtaomobile.com/wp-content/uploads/2026/07/checklist-mua-iphone-cu.jpg",
        published: true,
      },
      create: {
        slug: "cach-mua-iphone-cu-khong-bi-loi",
        title: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
        h1: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
        body: BLOG_BODY,
        metaTitle: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
        metaDescription: "Mua iPhone cũ cần kiểm tra gì? Checklist 10 bước từ A-Z: màn hình, pin, Face ID, IMEI, camera. Anh Táo Mobile Bình Dương — máy đẹp, bảo hành rõ ràng.",
        ogImage: "https://anhtaomobile.com/wp-content/uploads/2026/07/checklist-mua-iphone-cu.jpg",
        published: true,
      },
    });

    return NextResponse.json({ success: true, slug: result.slug });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
