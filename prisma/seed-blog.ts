import { prisma } from "../src/lib/db";

/**
 * SEO blog seed for Anh Táo Mobile.
 * Inserts keyword-targeted articles into the SeoPage model.
 * Run with: npm run db:seed:blog
 *
 * body is stored as HTML (blog renderer uses dangerouslySetInnerHTML + Tailwind `prose`).
 */

type BlogPost = {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
};

const posts: BlogPost[] = [
  {
    slug: "co-nen-mua-iphone-cu-khong",
    title: "Có nên mua iPhone cũ không? Ưu nhược điểm & lời khuyên 2026",
    h1: "Có nên mua iPhone cũ không? Kinh nghiệm mua iPhone cũ đáng tiền",
    metaTitle: "Có Nên Mua iPhone Cũ Không? Kinh Nghiệm & Lời Khuyên 2026",
    metaDescription:
      "Có nên mua iPhone cũ không? Phân tích ưu nhược điểm, cách chọn iPhone cũ giá tốt, tránh máy dựng tại Bình Dương. Bảo hành rõ ràng tại Anh Táo Mobile.",
    body: `
<p>Câu hỏi <strong>"có nên mua iPhone cũ không"</strong> được rất nhiều người đặt ra khi muốn dùng iPhone nhưng ngân sách hạn chế. Câu trả lời ngắn gọn: <strong>có</strong>, nếu bạn chọn đúng máy và mua ở nơi uy tín. Bài viết này sẽ giúp bạn hiểu rõ ưu nhược điểm và cách chọn iPhone cũ đáng tiền.</p>

<h2>Ưu điểm khi mua iPhone cũ</h2>
<ul>
  <li><strong>Tiết kiệm 30–50% chi phí</strong> so với máy mới cùng model. Bạn có thể lên đời dòng cao hơn với cùng số tiền.</li>
  <li><strong>iPhone giữ giá và bền</strong>: iOS được cập nhật nhiều năm, phần cứng Apple bền, máy cũ 99% dùng vẫn mượt.</li>
  <li><strong>Trải nghiệm gần như máy mới</strong> với dòng đời gần, đặc biệt iPhone 12, 13, 14, 15 cũ.</li>
</ul>

<h2>Nhược điểm cần cân nhắc</h2>
<ul>
  <li>Dung lượng pin đã hao mòn, có thể cần <a href="/thay-pin-iphone">thay pin iPhone</a> sau một thời gian.</li>
  <li>Rủi ro mua phải máy dựng, máy trôi bảo hành nếu mua ở nơi không uy tín.</li>
  <li>Không còn nguyên seal, ngoại hình có thể trầy xước nhẹ tùy mức độ.</li>
</ul>

<h2>Nên mua iPhone cũ dòng nào năm 2026?</h2>
<p>Tùy ngân sách, bạn có thể tham khảo:</p>
<ul>
  <li><strong>Tầm giá tốt:</strong> iPhone 11, iPhone 12 cũ — đủ dùng, chip khỏe, giá mềm.</li>
  <li><strong>Tầm trung:</strong> iPhone 13, iPhone 13 Pro Max cũ — cân bằng hiệu năng và pin.</li>
  <li><strong>Cao cấp:</strong> iPhone 14 Pro Max, iPhone 15 Pro Max cũ — gần như mới, camera đỉnh.</li>
</ul>
<p>Xem ngay danh sách <a href="/iphone-cu">iPhone cũ giá tốt</a> đang có tại cửa hàng.</p>

<h2>4 điều cần kiểm tra trước khi mua iPhone cũ</h2>
<ol>
  <li><strong>Kiểm tra iCloud:</strong> đảm bảo máy đã thoát iCloud, không dính iCloud ẩn.</li>
  <li><strong>Kiểm tra tình trạng pin:</strong> vào Cài đặt &gt; Pin &gt; Tình trạng pin, nên từ 85% trở lên.</li>
  <li><strong>Kiểm tra màn hình, cảm ứng, Face ID, camera, loa, mic.</strong></li>
  <li><strong>Kiểm tra IMEI</strong> khớp với hộp và trên máy (*#06#).</li>
</ol>
<p>Chi tiết hơn, đọc bài <a href="/blog/cach-kiem-tra-iphone-cu-truoc-khi-mua">cách kiểm tra iPhone cũ trước khi mua</a>.</p>

<h2>Mua iPhone cũ ở đâu uy tín tại Bình Dương?</h2>
<p><strong>Anh Táo Mobile</strong> chuyên iPhone cũ máy đẹp, kiểm tra kỹ, <strong>bảo hành rõ ràng</strong>: bảo hành pin 60 tháng, main 12 tháng 1 đổi 1. Mỗi máy đều được test đầy đủ trước khi giao. Bạn có thể đến trực tiếp cửa hàng tại 1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương để trải nghiệm.</p>

<h2>Kết luận</h2>
<p>Mua iPhone cũ là lựa chọn thông minh nếu bạn biết cách chọn và mua ở nơi uy tín. Hãy ưu tiên máy còn tốt, pin trên 85%, bảo hành rõ ràng. <a href="/iphone-cu">Xem iPhone cũ giá tốt tại Anh Táo Mobile</a> hoặc <a href="/lien-he">liên hệ để được tư vấn</a>.</p>
`,
  },
  {
    slug: "thay-pin-iphone-bao-nhieu-tien",
    title: "Thay pin iPhone bao nhiêu tiền? Bảng giá thay pin iPhone 2026",
    h1: "Thay pin iPhone bao nhiêu tiền? Bảng giá & khi nào nên thay",
    metaTitle: "Thay Pin iPhone Bao Nhiêu Tiền? Bảng Giá Mới Nhất 2026",
    metaDescription:
      "Thay pin iPhone bao nhiêu tiền 2026? Bảng giá thay pin iPhone các dòng, khi nào nên thay pin, thay pin lấy liền tại Bình Dương. Bảo hành pin 60 tháng.",
    body: `
<p><strong>Thay pin iPhone bao nhiêu tiền</strong> là điều nhiều người quan tâm khi máy bị tụt pin nhanh, sập nguồn đột ngột. Bài viết này cung cấp bảng giá tham khảo, dấu hiệu cần thay pin và địa chỉ thay pin iPhone uy tín tại Bình Dương.</p>

<h2>Khi nào nên thay pin iPhone?</h2>
<p>Bạn nên cân nhắc thay pin khi gặp các dấu hiệu sau:</p>
<ul>
  <li><strong>Tình trạng pin dưới 80%</strong> (Cài đặt &gt; Pin &gt; Tình trạng pin).</li>
  <li>Máy tụt pin nhanh bất thường, dùng vài tiếng đã hết.</li>
  <li>iPhone tự sập nguồn dù còn 20–40% pin.</li>
  <li>Máy nóng, phồng pin, hoặc báo "cần bảo dưỡng pin".</li>
</ul>
<p>Đọc thêm: <a href="/blog/dau-hieu-iphone-can-thay-pin">5 dấu hiệu iPhone cần thay pin ngay</a>.</p>

<h2>Bảng giá thay pin iPhone tham khảo 2026</h2>
<p>Giá thay pin phụ thuộc vào dòng máy và loại pin (pin dung lượng tiêu chuẩn hay pin dung lượng cao). Bảng dưới đây mang tính tham khảo:</p>
<table>
  <thead>
    <tr><th>Dòng máy</th><th>Giá tham khảo</th></tr>
  </thead>
  <tbody>
    <tr><td>iPhone X / XR / XS</td><td>Liên hệ báo giá</td></tr>
    <tr><td>iPhone 11 / 11 Pro / 11 Pro Max</td><td>Liên hệ báo giá</td></tr>
    <tr><td>iPhone 12 series</td><td>Liên hệ báo giá</td></tr>
    <tr><td>iPhone 13 series</td><td>Liên hệ báo giá</td></tr>
    <tr><td>iPhone 14 / 15 series</td><td>Liên hệ báo giá</td></tr>
  </tbody>
</table>
<p>Để có giá chính xác nhất theo tình trạng máy, vui lòng <a href="/lien-he">liên hệ Anh Táo Mobile</a> hoặc xem <a href="/thay-pin-iphone">dịch vụ thay pin iPhone</a>.</p>

<h2>Thay pin iPhone chính hãng hay pin dung lượng cao?</h2>
<ul>
  <li><strong>Pin tiêu chuẩn:</strong> dung lượng như pin zin, ổn định, phù hợp đa số người dùng.</li>
  <li><strong>Pin dung lượng cao:</strong> thời lượng dùng lâu hơn, hợp với người dùng nhiều, chơi game.</li>
</ul>
<p>Dù chọn loại nào, hãy đảm bảo pin có nguồn gốc rõ ràng và được lắp bởi kỹ thuật viên có tay nghề.</p>

<h2>Thay pin iPhone lấy liền tại Bình Dương</h2>
<p>Tại <strong>Anh Táo Mobile</strong>, dịch vụ thay pin iPhone:</p>
<ul>
  <li><strong>Lấy liền trong 30–60 phút</strong>, làm ngay tại cửa hàng.</li>
  <li>Kỹ thuật viên tay nghề cao, thao tác cẩn thận, không làm ảnh hưởng linh kiện khác.</li>
  <li><strong>Bảo hành pin lên đến 60 tháng</strong> — cam kết rõ ràng.</li>
</ul>
<p><a href="/dat-lich-sua-chua">Đặt lịch thay pin ngay</a> để được phục vụ nhanh nhất.</p>

<h2>Kết luận</h2>
<p>Chi phí thay pin iPhone tùy dòng máy và loại pin, nhưng quan trọng nhất là chọn nơi uy tín, pin chất lượng và bảo hành dài. <a href="/thay-pin-iphone">Xem dịch vụ thay pin iPhone tại Anh Táo Mobile</a> hoặc gọi hotline để được báo giá chi tiết.</p>
`,
  },
  {
    slug: "cach-kiem-tra-iphone-cu-truoc-khi-mua",
    title: "Cách kiểm tra iPhone cũ trước khi mua chuẩn nhất 2026",
    h1: "Cách kiểm tra iPhone cũ trước khi mua: 8 bước không thể bỏ qua",
    metaTitle: "Cách Kiểm Tra iPhone Cũ Trước Khi Mua Chuẩn Nhất 2026",
    metaDescription:
      "Hướng dẫn cách kiểm tra iPhone cũ trước khi mua: kiểm tra iCloud, pin, màn hình, Face ID, IMEI. Tránh mua máy dựng, máy lỗi. Mẹo từ Anh Táo Mobile.",
    body: `
<p>Biết <strong>cách kiểm tra iPhone cũ trước khi mua</strong> giúp bạn tránh mua phải máy dựng, máy lỗi ẩn hay máy dính iCloud. Dưới đây là 8 bước kiểm tra iPhone cũ ai cũng nên nắm khi mua máy đã qua sử dụng.</p>

<h2>1. Kiểm tra ngoại hình tổng thể</h2>
<p>Quan sát khung viền, mặt lưng, các cạnh xem có móp, trầy nặng, dấu hiệu bị bung máy không. Ốc vít nguyên vẹn, khe hở đều là dấu hiệu máy chưa bị can thiệp.</p>

<h2>2. Kiểm tra iCloud và tình trạng đăng xuất</h2>
<p>Đây là bước <strong>quan trọng nhất</strong>. Vào Cài đặt &gt; [Tên tài khoản] để chắc chắn máy đã đăng xuất iCloud của chủ cũ. Máy còn iCloud hoặc dính iCloud ẩn sẽ không thể sử dụng bình thường.</p>

<h2>3. Kiểm tra IMEI và số serial</h2>
<p>Bấm <strong>*#06#</strong> để xem IMEI, đối chiếu với IMEI trong Cài đặt &gt; Cài đặt chung &gt; Giới thiệu và trên hộp máy. Ba số này phải trùng khớp.</p>

<h2>4. Kiểm tra tình trạng pin</h2>
<p>Vào Cài đặt &gt; Pin &gt; Tình trạng pin. Nên chọn máy có dung lượng pin tối đa <strong>từ 85% trở lên</strong>. Nếu pin thấp, bạn có thể cân nhắc <a href="/thay-pin-iphone">thay pin iPhone</a>.</p>

<h2>5. Kiểm tra màn hình và cảm ứng</h2>
<ul>
  <li>Mở nền trắng và nền đen để phát hiện điểm chết, đốm, ám màu.</li>
  <li>Vuốt khắp màn hình kiểm tra cảm ứng có nhạy, có vùng liệt không.</li>
  <li>Kiểm tra True Tone và độ sáng tự động còn hoạt động.</li>
</ul>

<h2>6. Kiểm tra Face ID / Touch ID</h2>
<p>Thử cài lại Face ID hoặc Touch ID. Nếu không cài được, khả năng cao máy đã bị lỗi hoặc sửa chữa phần cứng cảm biến.</p>

<h2>7. Kiểm tra camera, loa, mic, kết nối</h2>
<ul>
  <li>Chụp ảnh, quay video cả camera trước và sau.</li>
  <li>Gọi thử để test loa trong, loa ngoài và mic.</li>
  <li>Kiểm tra Wi-Fi, Bluetooth, sóng, cổng sạc.</li>
</ul>

<h2>8. Kiểm tra nguồn gốc và bảo hành</h2>
<p>Ưu tiên mua máy có bảo hành rõ ràng bằng văn bản. Tại <strong>Anh Táo Mobile</strong>, mọi máy đều được test kỹ và <a href="/bao-hanh">bảo hành minh bạch</a>, giúp bạn yên tâm tuyệt đối.</p>

<h2>Kết luận</h2>
<p>Nắm chắc cách kiểm tra iPhone cũ trước khi mua sẽ giúp bạn chọn được máy tốt, giá hợp lý. Nếu chưa tự tin, hãy chọn nơi uy tín có bảo hành. <a href="/iphone-cu">Xem iPhone cũ đã kiểm định tại Anh Táo Mobile</a> để mua an tâm.</p>
`,
  },
  {
    slug: "dau-hieu-iphone-can-thay-pin",
    title: "5 dấu hiệu iPhone cần thay pin ngay bạn không nên bỏ qua",
    h1: "5 dấu hiệu iPhone cần thay pin ngay",
    metaTitle: "5 Dấu Hiệu iPhone Cần Thay Pin Ngay | Anh Táo Mobile",
    metaDescription:
      "Nhận biết 5 dấu hiệu iPhone cần thay pin: tụt pin nhanh, sập nguồn, phồng pin, máy nóng, chai pin dưới 80%. Thay pin iPhone lấy liền, bảo hành 60 tháng.",
    body: `
<p>Pin iPhone sau 1–2 năm sử dụng sẽ chai dần và ảnh hưởng đến trải nghiệm. Nhận biết sớm <strong>dấu hiệu iPhone cần thay pin</strong> giúp bạn tránh những phiền toái như sập nguồn đột ngột, máy giật lag. Dưới đây là 5 dấu hiệu rõ nhất.</p>

<h2>1. Tình trạng pin dưới 80%</h2>
<p>Vào Cài đặt &gt; Pin &gt; Tình trạng pin. Khi dung lượng pin tối đa <strong>tụt dưới 80%</strong>, Apple khuyến nghị thay pin. Đây là dấu hiệu định lượng rõ ràng nhất.</p>

<h2>2. Máy tụt pin nhanh bất thường</h2>
<p>Nếu iPhone đang dùng bình thường bỗng hết pin rất nhanh, sạc đầy nhưng chỉ dùng được vài tiếng, đó là dấu hiệu pin đã xuống cấp nặng.</p>

<h2>3. iPhone tự sập nguồn dù còn pin</h2>
<p>Máy tắt đột ngột khi còn 20–40% pin, đặc biệt khi trời lạnh hoặc chạy ứng dụng nặng. Pin chai không còn cung cấp đủ dòng điện ổn định.</p>

<h2>4. Máy nóng, chậm, giật lag</h2>
<p>Khi pin yếu, iOS tự giảm hiệu năng để tránh sập nguồn, khiến máy chậm đi. Máy cũng có thể nóng bất thường khi sạc hoặc sử dụng.</p>

<h2>5. Pin phồng, cấn màn hình</h2>
<p>Đây là dấu hiệu <strong>nguy hiểm</strong>, cần thay pin ngay. Pin phồng có thể đẩy màn hình hở, ẩn nguy cơ cháy nổ. Tuyệt đối không tiếp tục dùng.</p>

<h2>Nên làm gì khi iPhone có dấu hiệu cần thay pin?</h2>
<p>Hãy mang máy đến địa chỉ uy tín để kiểm tra và <a href="/thay-pin-iphone">thay pin iPhone</a> với pin chất lượng, kỹ thuật viên tay nghề cao. Tham khảo thêm <a href="/blog/thay-pin-iphone-bao-nhieu-tien">thay pin iPhone bao nhiêu tiền</a> để biết chi phí.</p>
<p>Tại <strong>Anh Táo Mobile</strong>, thay pin iPhone lấy liền 30–60 phút, <strong>bảo hành pin lên đến 60 tháng</strong>. <a href="/dat-lich-sua-chua">Đặt lịch ngay</a> để được phục vụ nhanh.</p>

<h2>Kết luận</h2>
<p>Đừng đợi iPhone hỏng hẳn mới thay pin. Chỉ cần một trong các dấu hiệu trên, bạn nên kiểm tra và thay pin sớm để dùng máy êm ái, an toàn.</p>
`,
  },
  {
    slug: "kinh-nghiem-sua-iphone",
    title: "Kinh nghiệm sửa iPhone: thay màn hình, ép kính, sửa main an toàn",
    h1: "Kinh nghiệm sửa iPhone: chọn đúng dịch vụ, tránh mất tiền oan",
    metaTitle: "Kinh Nghiệm Sửa iPhone: Thay Màn Hình, Ép Kính, Sửa Main 2026",
    metaDescription:
      "Kinh nghiệm sửa iPhone: khi nào thay màn hình hay ép kính, sửa main iPhone, chọn linh kiện, tránh bị chặt chém. Sửa iPhone lấy liền tại Bình Dương.",
    body: `
<p>Sửa iPhone đúng cách giúp bạn tiết kiệm chi phí và giữ máy bền lâu. Bài viết tổng hợp <strong>kinh nghiệm sửa iPhone</strong> phổ biến nhất: thay màn hình, ép kính, sửa main, cùng lời khuyên chọn nơi uy tín.</p>

<h2>Thay màn hình hay ép kính iPhone?</h2>
<p>Nhiều người nhầm lẫn hai dịch vụ này:</p>
<ul>
  <li><strong>Ép kính:</strong> chỉ thay lớp kính ngoài bị nứt, giữ nguyên tấm nền hiển thị và cảm ứng. Chi phí thấp hơn, áp dụng khi màn hình <em>vẫn hiển thị và cảm ứng tốt</em>.</li>
  <li><strong>Thay màn hình:</strong> thay cả cụm màn hình khi tấm nền bị sọc, đốm, chảy mực, liệt cảm ứng.</li>
</ul>
<p>Xem dịch vụ <a href="/thay-man-hinh-iphone">thay màn hình iPhone</a> và <a href="/ep-kinh-iphone">ép kính iPhone</a> để chọn đúng nhu cầu.</p>

<h2>Sửa main iPhone — khi nào cần?</h2>
<p>Lỗi main thường gặp: mất nguồn, mất sóng, không lên màn, sập nguồn liên tục, không nhận sạc. Sửa main đòi hỏi kỹ thuật viên tay nghề cao và thiết bị chuyên dụng. Hãy chọn nơi có kinh nghiệm để tránh hư hại nặng hơn.</p>

<h2>Kinh nghiệm chọn linh kiện khi sửa iPhone</h2>
<ul>
  <li>Hỏi rõ loại linh kiện (zin, zin bóc máy, hay linh kiện lắp ráp) và giá tương ứng.</li>
  <li>Yêu cầu bảo hành bằng văn bản cho mỗi hạng mục sửa chữa.</li>
  <li>Ưu tiên nơi sửa công khai, cho xem máy trong quá trình sửa.</li>
</ul>

<h2>Cách tránh bị "chặt chém" khi sửa iPhone</h2>
<ol>
  <li>Kiểm tra máy và báo giá <strong>trước khi sửa</strong>, không sửa khi chưa rõ giá.</li>
  <li>So sánh giá tham khảo ở vài nơi uy tín.</li>
  <li>Giữ lại linh kiện cũ sau khi thay nếu muốn.</li>
  <li>Chọn cửa hàng có bảo hành rõ ràng, địa chỉ cố định.</li>
</ol>

<h2>Sửa iPhone lấy liền, uy tín tại Bình Dương</h2>
<p><strong>Anh Táo Mobile</strong> nhận sửa chữa iPhone đa dạng: thay pin, thay màn hình, ép kính, sửa main. Kỹ thuật viên tay nghề cao, báo giá minh bạch trước khi sửa, <strong>sửa lấy liền</strong> và bảo hành rõ ràng. Xem tất cả <a href="/sua-chua">dịch vụ sửa chữa</a> hoặc <a href="/dat-lich-sua-chua">đặt lịch sửa chữa</a>.</p>

<h2>Kết luận</h2>
<p>Nắm rõ kinh nghiệm sửa iPhone giúp bạn chọn đúng dịch vụ, đúng linh kiện và tránh mất tiền oan. Quan trọng nhất là chọn nơi uy tín, báo giá rõ ràng và bảo hành đầy đủ.</p>
`,
  },
];

async function main() {
  console.log(`Seeding ${posts.length} blog posts...`);
  for (const p of posts) {
    await prisma.seoPage.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        h1: p.h1,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        body: p.body.trim(),
        published: true,
      },
      create: {
        slug: p.slug,
        title: p.title,
        h1: p.h1,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        body: p.body.trim(),
        published: true,
      },
    });
    console.log(`  ✓ ${p.slug}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
