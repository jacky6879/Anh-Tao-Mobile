import { prisma } from "../src/lib/db";

/**
 * SEO blog seed (batch 2) for Anh Táo Mobile.
 * These 10 articles are inserted as DRAFTS (published: false)
 * so you can toggle each one live one-per-day (drip publishing) from admin.
 * Run with: npm run db:seed:blog:2
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
    slug: "nen-mua-iphone-nao-2026",
    title: "Nên mua iPhone nào 2026? Gợi ý theo nhu cầu & ngân sách",
    h1: "Nên mua iPhone nào 2026? Chọn máy đúng nhu cầu, đúng túi tiền",
    metaTitle: "Nên Mua iPhone Nào 2026? Gợi Ý Theo Ngân Sách | Anh Táo Mobile",
    metaDescription:
      "Nên mua iPhone nào 2026? So sánh các dòng iPhone theo nhu cầu và ngân sách, gợi ý máy đáng mua nhất. Tư vấn miễn phí tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Apple có quá nhiều dòng máy khiến việc chọn mua khó khăn. Bài viết này giúp bạn trả lời câu hỏi <strong>"nên mua iPhone nào"</strong> dựa trên nhu cầu thực tế và ngân sách, thay vì chạy theo model mới nhất.</p>

<h2>Chọn iPhone theo ngân sách</h2>
<ul>
  <li><strong>Dưới 8 triệu:</strong> iPhone 11, iPhone XR cũ — đủ dùng mạng xã hội, gọi điện, chụp ảnh cơ bản.</li>
  <li><strong>8–13 triệu:</strong> iPhone 12, iPhone 13 cũ — hiệu năng mạnh, màn OLED đẹp, dùng bền 3–4 năm.</li>
  <li><strong>13–18 triệu:</strong> iPhone 14, iPhone 15 cũ — camera tốt, pin khỏe, hợp người dùng lâu dài.</li>
</ul>

<h2>Chọn iPhone theo nhu cầu</h2>
<ul>
  <li><strong>Chụp ảnh, quay video:</strong> ưu tiên bản Pro / Pro Max để có camera tele và quay 4K mượt.</li>
  <li><strong>Chơi game nặng:</strong> chọn dòng đời gần với chip A15 trở lên để chạy ổn định lâu dài.</li>
  <li><strong>Dùng cơ bản, pin trâu:</strong> các bản Plus / Max thường có pin dung lượng lớn hơn.</li>
</ul>

<h2>Nên mua máy mới hay iPhone cũ?</h2>
<p>Nếu ngân sách hạn chế, <a href="/iphone-cu">iPhone cũ</a> chính hãng là lựa chọn thông minh: tiết kiệm 30–50% mà trải nghiệm gần như máy mới. Quan trọng là mua ở nơi kiểm tra kỹ và bảo hành rõ ràng. Xem thêm <a href="/blog/co-nen-mua-iphone-cu-khong">có nên mua iPhone cũ không</a> để cân nhắc.</p>

<h2>Mẹo trước khi chốt máy</h2>
<ol>
  <li>Kiểm tra tình trạng pin — nếu chai nhiều có thể <a href="/thay-pin-iphone">thay pin iPhone</a> để dùng bền hơn.</li>
  <li>Xem kỹ màn hình, cảm ứng, Face ID, loa, mic.</li>
  <li>Đối chiếu số IMEI và kiểm tra iCloud đã đăng xuất chưa.</li>
</ol>

<p>Chưa biết chọn máy nào? Ghé <strong>Anh Táo Mobile</strong> tại 1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương để được tư vấn miễn phí, hoặc <a href="/dat-lich-sua-chua">đặt lịch</a> để được hỗ trợ nhanh.</p>
`,
  },
  {
    slug: "iphone-bi-treo-tao-do-may-cach-xu-ly",
    title: "iPhone bị treo táo, đơ máy: nguyên nhân & cách xử lý",
    h1: "iPhone bị treo táo, đơ máy phải làm sao? Cách khắc phục nhanh",
    metaTitle: "iPhone Bị Treo Táo, Đơ Máy: Cách Xử Lý Nhanh | Anh Táo Mobile",
    metaDescription:
      "iPhone bị treo táo, đơ máy, không lên nguồn? Hướng dẫn cách xử lý tại nhà và khi nào cần mang đi sửa. Kiểm tra miễn phí tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Máy đang dùng bỗng đứng hình, hoặc khởi động lại rồi kẹt ở logo quả táo — đây là lỗi <strong>iPhone bị treo táo</strong> khá phổ biến. Đa số trường hợp xử lý được tại nhà, nhưng cũng có nguyên nhân phần cứng cần thợ can thiệp.</p>

<h2>Nguyên nhân iPhone bị treo táo, đơ máy</h2>
<ul>
  <li>Lỗi phần mềm sau khi cập nhật iOS hoặc jailbreak.</li>
  <li>Bộ nhớ đầy, quá nhiều ứng dụng chạy nền.</li>
  <li>Pin chai nặng khiến máy sập nguồn đột ngột.</li>
  <li>Lỗi phần cứng: hỏng IC nguồn, main sau va đập hoặc vào nước.</li>
</ul>

<h2>Cách xử lý tại nhà</h2>
<ol>
  <li><strong>Khởi động lại cứng (force restart):</strong> với iPhone 8 trở lên, nhấn nhả nhanh nút Tăng âm lượng, rồi Giảm âm lượng, sau đó giữ nút Nguồn đến khi thấy logo táo.</li>
  <li><strong>Giải phóng bộ nhớ:</strong> xóa bớt ảnh, video, app không dùng.</li>
  <li><strong>Cập nhật hoặc khôi phục iOS</strong> qua máy tính nếu máy vẫn treo.</li>
</ol>

<h2>Khi nào cần mang đi sửa?</h2>
<p>Nếu đã thử các bước trên mà máy vẫn kẹt logo, tự tắt nguồn, hoặc từng va đập / vào nước thì khả năng cao là lỗi phần cứng. Lúc này bạn nên mang máy đến trung tâm để kiểm tra main và nguồn. Xem thêm dịch vụ <a href="/sua-chua">sửa chữa iPhone</a> của chúng tôi.</p>

<p>Nếu nguyên nhân là pin chai gây sập nguồn, việc <a href="/thay-pin-iphone">thay pin iPhone</a> sẽ giải quyết dứt điểm. Tại <strong>Anh Táo Mobile</strong>, máy được kiểm tra miễn phí, sửa lấy liền 30–60 phút và bảo hành rõ ràng. <a href="/dat-lich-sua-chua">Đặt lịch</a> ngay để được hỗ trợ.</p>
`,
  },
  {
    slug: "iphone-sac-khong-vao-nguyen-nhan-cach-khac-phuc",
    title: "iPhone sạc không vào: nguyên nhân và cách khắc phục",
    h1: "iPhone sạc không vào pin? Nguyên nhân & cách khắc phục hiệu quả",
    metaTitle: "iPhone Sạc Không Vào: Nguyên Nhân & Cách Khắc Phục | Anh Táo Mobile",
    metaDescription:
      "iPhone sạc không vào pin, sạc chập chờn? Tìm hiểu nguyên nhân từ cáp, chân sạc đến IC sạc và cách khắc phục. Kiểm tra miễn phí tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Cắm sạc nhưng máy không lên phần trăm, hoặc sạc lúc được lúc không là tình trạng khiến nhiều người lo lắng. Lỗi <strong>iPhone sạc không vào</strong> có thể đến từ phụ kiện đơn giản, cũng có thể từ phần cứng bên trong.</p>

<h2>Nguyên nhân thường gặp</h2>
<ul>
  <li><strong>Cáp hoặc củ sạc hỏng:</strong> đây là nguyên nhân phổ biến nhất, thử đổi cáp khác trước.</li>
  <li><strong>Chân sạc bám bụi, ẩm:</strong> bụi vải trong cổng Lightning/USB-C cản tiếp xúc.</li>
  <li><strong>Pin chai hoặc lỗi:</strong> pin xuống cấp khiến máy báo sạc nhưng không nhận.</li>
  <li><strong>Lỗi IC sạc, chân sạc trên main:</strong> thường sau va đập hoặc vào nước.</li>
</ul>

<h2>Cách tự kiểm tra tại nhà</h2>
<ol>
  <li>Đổi sang <strong>cáp và củ sạc chính hãng</strong> khác để loại trừ phụ kiện.</li>
  <li>Vệ sinh chân sạc nhẹ nhàng bằng cọ mềm khô, không dùng vật kim loại.</li>
  <li>Khởi động lại máy, thử sạc ở ổ điện khác.</li>
  <li>Kiểm tra tình trạng pin trong Cài đặt &gt; Pin &gt; Tình trạng pin.</li>
</ol>

<h2>Khi nào cần thợ can thiệp?</h2>
<p>Nếu đã đổi cáp, vệ sinh chân sạc mà máy vẫn không nhận sạc, khả năng là hỏng <strong>chân sạc</strong> hoặc <strong>IC sạc</strong> trên main — cần thợ tháo máy kiểm tra. Nếu tình trạng pin dưới 80%, bạn nên <a href="/thay-pin-iphone">thay pin iPhone</a> để sạc ổn định trở lại.</p>

<p>Xem thêm dịch vụ <a href="/sua-chua">sửa chữa iPhone</a>. Tại <strong>Anh Táo Mobile</strong>, chúng tôi kiểm tra chân sạc và IC miễn phí, báo giá trước khi sửa, bảo hành rõ ràng. <a href="/dat-lich-sua-chua">Đặt lịch</a> để được hỗ trợ nhanh.</p>
`,
  },
  {
    slug: "mua-iphone-tra-gop-can-nhung-gi",
    title: "Mua iPhone trả góp cần những gì? Thủ tục & lưu ý 2026",
    h1: "Mua iPhone trả góp cần những gì? Hướng dẫn thủ tục từ A–Z",
    metaTitle: "Mua iPhone Trả Góp Cần Những Gì? Thủ Tục 2026 | Anh Táo Mobile",
    metaDescription:
      "Mua iPhone trả góp cần những gì? Điều kiện, thủ tục, giấy tờ và lưu ý để duyệt nhanh, lãi thấp. Hỗ trợ trả góp iPhone tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Trả góp giúp bạn sở hữu iPhone ngay mà không cần trả hết một lần. Nhưng <strong>mua iPhone trả góp cần những gì</strong>? Bài viết tổng hợp điều kiện, thủ tục và lưu ý để hồ sơ được duyệt nhanh, tránh lãi cao.</p>

<h2>Điều kiện mua trả góp</h2>
<ul>
  <li>Là công dân Việt Nam, độ tuổi thường từ 20–60.</li>
  <li>Có CCCD/CMND còn hiệu lực.</li>
  <li>Có thêm giấy tờ phụ: bằng lái xe, hộ khẩu, hoặc thẻ tín dụng tùy hình thức.</li>
</ul>

<h2>Các hình thức trả góp phổ biến</h2>
<ol>
  <li><strong>Qua công ty tài chính:</strong> chỉ cần CCCD + giấy tờ phụ, duyệt nhanh trong ngày.</li>
  <li><strong>Qua thẻ tín dụng:</strong> lãi suất 0% nếu ngân hàng có chương trình, hạn mức tùy thẻ.</li>
</ol>

<h2>Thủ tục và lưu ý để duyệt nhanh</h2>
<ul>
  <li>Chuẩn bị đầy đủ giấy tờ gốc, thông tin liên hệ chính xác.</li>
  <li>Đọc kỹ lãi suất, phí phạt trả trước hạn trong hợp đồng.</li>
  <li>Tính tổng số tiền phải trả để so sánh với giá mua trả thẳng.</li>
</ul>

<p>Tại <strong>Anh Táo Mobile</strong>, bạn có thể mua <a href="/iphone-cu">iPhone</a> theo hình thức <a href="/tra-gop">trả góp</a> với thủ tục gọn nhẹ. Chưa chắc chọn máy nào? Xem <a href="/blog/nen-mua-iphone-nao-2026">nên mua iPhone nào 2026</a> để cân nhắc trước khi chốt.</p>

<p>Cần tư vấn gói trả góp phù hợp? <a href="/dat-lich-sua-chua">Đặt lịch</a> hoặc ghé cửa hàng tại 1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương.</p>
`,
  },
  {
    slug: "thu-cu-doi-moi-iphone-co-loi-khong",
    title: "Thu cũ đổi mới iPhone có lợi không? Cách định giá máy cũ",
    h1: "Thu cũ đổi mới iPhone có lợi không? Kinh nghiệm lên đời tiết kiệm",
    metaTitle: "Thu Cũ Đổi Mới iPhone Có Lợi Không? | Anh Táo Mobile",
    metaDescription:
      "Thu cũ đổi mới iPhone có lợi không? Cách định giá máy cũ, các yếu tố ảnh hưởng giá thu và mẹo lên đời tiết kiệm. Thu cũ đổi mới tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Muốn lên đời iPhone nhưng tiếc chiếc máy đang dùng? <strong>Thu cũ đổi mới</strong> là giải pháp giúp bạn lấy giá trị máy cũ trừ thẳng vào máy mới. Vậy hình thức này có thực sự lợi?</p>

<h2>Thu cũ đổi mới hoạt động thế nào?</h2>
<p>Cửa hàng định giá máy cũ của bạn dựa trên tình trạng, sau đó trừ số tiền đó vào giá máy bạn muốn mua. Bạn chỉ cần bù phần chênh lệch.</p>

<h2>Các yếu tố ảnh hưởng giá thu</h2>
<ul>
  <li><strong>Đời máy và dung lượng:</strong> máy đời gần, bộ nhớ lớn được giá cao hơn.</li>
  <li><strong>Tình trạng ngoại hình:</strong> trầy xước, móp méo làm giảm giá.</li>
  <li><strong>Tình trạng pin:</strong> pin chai nhiều bị trừ giá — cân nhắc <a href="/thay-pin-iphone">thay pin iPhone</a> trước nếu đáng.</li>
  <li><strong>Zin hay đã sửa:</strong> máy nguyên zin luôn được định giá tốt hơn.</li>
</ul>

<h2>Thu cũ đổi mới có lợi không?</h2>
<p>Có, nếu bạn muốn <strong>tiện lợi và nhanh gọn</strong>: không phải rao bán, không lo gặp khách "bùng". Đổi lại, giá thu có thể thấp hơn bán lẻ một chút. Nếu ưu tiên thời gian và an toàn thì rất đáng.</p>

<h2>Mẹo được giá thu tốt</h2>
<ol>
  <li>Vệ sinh máy, giữ nguyên hộp và phụ kiện nếu còn.</li>
  <li>Đăng xuất iCloud, khôi phục cài đặt gốc trước khi mang đi.</li>
  <li>So sánh giá thu ở vài nơi uy tín.</li>
</ol>

<p>Tại <strong>Anh Táo Mobile</strong>, chúng tôi định giá minh bạch và hỗ trợ đổi sang <a href="/iphone-cu">iPhone</a> khác nhanh chóng. <a href="/dat-lich-sua-chua">Đặt lịch</a> để được định giá máy cũ miễn phí.</p>
`,
  },
  {
    slug: "cach-phan-biet-iphone-hang-dung",
    title: "Cách phân biệt iPhone hàng dựng, hàng zin chính xác",
    h1: "Cách phân biệt iPhone hàng dựng và hàng zin để tránh mua hớ",
    metaTitle: "Cách Phân Biệt iPhone Hàng Dựng & Hàng Zin | Anh Táo Mobile",
    metaDescription:
      "Cách phân biệt iPhone hàng dựng và hàng zin: kiểm tra IMEI, linh kiện, màn hình, ốc vít. Tránh mua máy dựng khi mua iPhone cũ. Kiểm tra tại Anh Táo Mobile Bình Dương.",
    body: `
<p>iPhone "hàng dựng" là máy đã bị thay nhiều linh kiện không chính hãng rồi lắp ráp lại để bán như máy nguyên. Biết <strong>cách phân biệt iPhone hàng dựng</strong> giúp bạn tránh mua hớ khi chọn iPhone cũ.</p>

<h2>Dấu hiệu nhận biết iPhone hàng dựng</h2>
<ul>
  <li><strong>Ốc vít trầy, không đều:</strong> dấu hiệu máy từng bị mở, tháo lắp nhiều lần.</li>
  <li><strong>Màn hình ám màu, cảm ứng rê:</strong> có thể đã thay màn lô kém chất lượng.</li>
  <li><strong>Khe hở viền máy không khít:</strong> ráp lại không chuẩn.</li>
  <li><strong>Face ID / Touch ID lỗi:</strong> linh kiện không đồng bộ.</li>
</ul>

<h2>Cách kiểm tra chính xác</h2>
<ol>
  <li><strong>Đối chiếu IMEI:</strong> bấm *#06# và so với Cài đặt &gt; Cài đặt chung &gt; Giới thiệu, kiểm tra trên trang tra cứu của Apple.</li>
  <li><strong>Kiểm tra tình trạng pin:</strong> Cài đặt &gt; Pin &gt; Tình trạng pin — nếu không hiện thông tin, khả năng pin đã bị thay.</li>
  <li><strong>Test đầy đủ chức năng:</strong> camera, loa, mic, cảm biến, sạc.</li>
  <li><strong>Kiểm tra thông báo linh kiện</strong> trong phần Giới thiệu (Apple báo linh kiện không xác thực).</li>
</ol>

<h2>An tâm nhất là mua nơi uy tín</h2>
<p>Cách chắc chắn nhất để tránh hàng dựng là mua ở nơi kiểm tra kỹ và cam kết bảo hành. Xem thêm <a href="/blog/cach-kiem-tra-iphone-cu-truoc-khi-mua">cách kiểm tra iPhone cũ trước khi mua</a> và <a href="/blog/co-nen-mua-iphone-cu-khong">có nên mua iPhone cũ không</a>.</p>

<p>Tại <strong>Anh Táo Mobile</strong>, mọi <a href="/iphone-cu">iPhone cũ</a> đều được kiểm tra linh kiện, cam kết nguyên zin và bảo hành rõ ràng. <a href="/dat-lich-sua-chua">Đặt lịch</a> để được hỗ trợ kiểm tra máy.</p>
`,
  },
  {
    slug: "iphone-bi-soc-man-hinh-nguyen-nhan-cach-sua",
    title: "iPhone bị sọc màn hình: nguyên nhân và cách sửa",
    h1: "iPhone bị sọc màn hình phải làm sao? Nguyên nhân & cách khắc phục",
    metaTitle: "iPhone Bị Sọc Màn Hình: Nguyên Nhân & Cách Sửa | Anh Táo Mobile",
    metaDescription:
      "iPhone bị sọc màn hình, nhấp nháy, loang màu? Tìm hiểu nguyên nhân do rơi vỡ, ẩm hay lỗi cáp màn và cách khắc phục. Sửa lấy liền tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Màn hình xuất hiện những vệt sọc dọc, sọc ngang, nhấp nháy hoặc loang màu khiến máy khó dùng. Lỗi <strong>iPhone bị sọc màn hình</strong> thường liên quan đến màn hình hoặc cáp kết nối, cần xác định đúng nguyên nhân để sửa dứt điểm.</p>

<h2>Nguyên nhân iPhone bị sọc màn hình</h2>
<ul>
  <li><strong>Rơi vỡ, va đập:</strong> làm lỏng hoặc đứt cáp màn hình.</li>
  <li><strong>Vào nước, ẩm:</strong> gây oxy hóa chân cáp, chập mạch hiển thị.</li>
  <li><strong>Lỗi tấm nền màn hình:</strong> sau thời gian dài sử dụng hoặc do màn kém chất lượng.</li>
  <li><strong>Lỗi IC hiển thị trên main:</strong> ít gặp hơn nhưng nghiêm trọng.</li>
</ul>

<h2>Cách kiểm tra và xử lý ban đầu</h2>
<ol>
  <li><strong>Khởi động lại máy</strong> để loại trừ lỗi phần mềm tạm thời.</li>
  <li>Quan sát sọc màn cố định hay chỉ xuất hiện khi chạm/uốn máy — nếu theo thao tác thì khả năng lỏng cáp.</li>
  <li>Không tự ý ấn mạnh hay tháo máy nếu không có dụng cụ chuyên dụng.</li>
</ol>

<h2>Khi nào cần thay màn hình?</h2>
<p>Nếu sọc màn cố định, lan rộng theo thời gian, hoặc kèm chạm cảm ứng loạn thì thường phải <a href="/thay-man-hinh-iphone">thay màn hình iPhone</a>. Trường hợp chỉ nứt kính mặt ngoài mà hiển thị còn tốt, có thể chỉ cần <a href="/ep-kinh-iphone">ép kính iPhone</a> để tiết kiệm.</p>

<p>Xem thêm dịch vụ <a href="/sua-chua">sửa chữa iPhone</a>. Tại <strong>Anh Táo Mobile</strong>, chúng tôi kiểm tra miễn phí, báo giá trước, sửa lấy liền 30–60 phút và bảo hành rõ ràng. <a href="/dat-lich-sua-chua">Đặt lịch</a> để được hỗ trợ nhanh.</p>
`,
  },
  {
    slug: "iphone-bi-vao-nuoc-cach-xu-ly-khan-cap",
    title: "iPhone bị vào nước: cách xử lý khẩn cấp đúng cách",
    h1: "iPhone bị vào nước phải làm gì? Xử lý khẩn cấp để cứu máy",
    metaTitle: "iPhone Bị Vào Nước: Cách Xử Lý Khẩn Cấp | Anh Táo Mobile",
    metaDescription:
      "iPhone bị vào nước phải làm gì? Các bước xử lý khẩn cấp đúng cách và những sai lầm cần tránh để cứu máy. Cứu iPhone vào nước tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Làm rơi máy vào nước, dính mưa hay đổ nước là tình huống dễ khiến iPhone hỏng nặng nếu xử lý sai. Biết <strong>iPhone bị vào nước phải làm gì</strong> trong những phút đầu quyết định khả năng cứu máy.</p>

<h2>Cần làm ngay khi iPhone vào nước</h2>
<ol>
  <li><strong>Tắt nguồn ngay lập tức</strong> để tránh chập mạch. Không cắm sạc.</li>
  <li>Lau khô bên ngoài, tháo ốp lưng, SIM.</li>
  <li>Dốc nhẹ để nước thoát khỏi các cổng, giữ máy thẳng đứng.</li>
  <li><strong>Mang đến trung tâm càng sớm càng tốt</strong> để vệ sinh main, chống oxy hóa.</li>
</ol>

<h2>Những sai lầm khiến máy hỏng nặng hơn</h2>
<ul>
  <li><strong>Bật nguồn hoặc cắm sạc</strong> khi máy còn ẩm — dễ gây chập, cháy IC.</li>
  <li><strong>Dùng máy sấy nóng</strong> — nhiệt cao làm hỏng linh kiện và keo màn.</li>
  <li><strong>Vùi vào gạo</strong> — mẹo dân gian không rút được nước bên trong main, còn làm bụi gạo kẹt vào cổng.</li>
  <li><strong>Lắc mạnh</strong> — đẩy nước lan sâu vào bo mạch.</li>
</ul>

<h2>Vì sao cần vệ sinh main sớm?</h2>
<p>Nước để lâu trong máy gây oxy hóa, ăn mòn mạch dẫn đến lỗi nguồn, màn, cảm ứng về sau — dù ban đầu máy vẫn chạy. Vệ sinh main kịp thời giúp giảm rủi ro hư hỏng nặng. Nếu sau đó máy gặp lỗi hiển thị, xem thêm <a href="/blog/iphone-bi-soc-man-hinh-nguyen-nhan-cach-sua">iPhone bị sọc màn hình</a>.</p>

<p>Xem thêm dịch vụ <a href="/sua-chua">sửa chữa iPhone</a>. Tại <strong>Anh Táo Mobile</strong>, chúng tôi vệ sinh main, chống oxy hóa chuyên nghiệp, kiểm tra miễn phí và báo giá trước khi sửa. <a href="/dat-lich-sua-chua">Đặt lịch</a> ngay để tăng khả năng cứu máy.</p>
`,
  },
  {
    slug: "cach-tiet-kiem-pin-iphone-hieu-qua",
    title: "Cách tiết kiệm pin iPhone hiệu quả, dùng lâu hơn mỗi ngày",
    h1: "Cách tiết kiệm pin iPhone: mẹo giúp máy dùng lâu hơn cả ngày",
    metaTitle: "Cách Tiết Kiệm Pin iPhone Hiệu Quả 2026 | Anh Táo Mobile",
    metaDescription:
      "Cách tiết kiệm pin iPhone: tối ưu cài đặt, hạn chế hao pin và mẹo dùng máy lâu hơn. Khi nào nên thay pin? Kiểm tra tình trạng pin tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Pin tụt nhanh khiến bạn phải sạc liên tục và bất tiện khi ra ngoài. Áp dụng đúng <strong>cách tiết kiệm pin iPhone</strong> giúp máy trụ lâu hơn cả ngày mà không cần đổi thiết bị.</p>

<h2>Tối ưu cài đặt để tiết kiệm pin</h2>
<ul>
  <li><strong>Bật Chế độ nguồn điện thấp</strong> khi pin xuống thấp (Cài đặt &gt; Pin).</li>
  <li><strong>Giảm độ sáng màn hình</strong> và bật Tự động điều chỉnh độ sáng.</li>
  <li><strong>Tắt Làm mới ứng dụng nền</strong> cho các app không cần thiết.</li>
  <li><strong>Dùng Wi-Fi thay vì 4G/5G</strong> khi có thể, tắt dịch vụ định vị cho app không cần.</li>
</ul>

<h2>Thói quen giúp pin bền hơn</h2>
<ol>
  <li>Không để máy quá nóng hoặc quá lạnh — nhiệt độ cao làm chai pin nhanh.</li>
  <li>Bật <strong>Sạc pin tối ưu</strong> để hạn chế chai khi sạc qua đêm.</li>
  <li>Dùng củ sạc và cáp chính hãng, tránh sạc dỏm.</li>
  <li>Không để cạn kiệt 0% thường xuyên; duy trì trong khoảng 20–80% là lý tưởng.</li>
</ol>

<h2>Khi nào tiết kiệm pin không còn đủ?</h2>
<p>Nếu tình trạng pin (Cài đặt &gt; Pin &gt; Tình trạng pin) dưới 80%, máy sẽ tụt nhanh dù đã tối ưu — đây là lúc nên <a href="/thay-pin-iphone">thay pin iPhone</a> để lấy lại thời lượng như ban đầu. Xem thêm <a href="/blog/dau-hieu-iphone-can-thay-pin">dấu hiệu iPhone cần thay pin</a> để nhận biết sớm.</p>

<p>Tại <strong>Anh Táo Mobile</strong>, chúng tôi kiểm tra tình trạng pin miễn phí, thay pin lấy liền và bảo hành pin lên đến 60 tháng. <a href="/dat-lich-sua-chua">Đặt lịch</a> để được hỗ trợ nhanh.</p>
`,
  },
  {
    slug: "iphone-lock-la-gi-co-nen-mua-khong",
    title: "iPhone lock là gì? Có nên mua iPhone lock không?",
    h1: "iPhone lock là gì? Ưu nhược điểm và có nên mua iPhone lock?",
    metaTitle: "iPhone Lock Là Gì? Có Nên Mua Không? | Anh Táo Mobile",
    metaDescription:
      "iPhone lock là gì, khác gì bản quốc tế? Ưu nhược điểm, rủi ro khi dùng iPhone lock và có nên mua không. Tư vấn chọn iPhone phù hợp tại Anh Táo Mobile Bình Dương.",
    body: `
<p>Khi mua iPhone cũ, bạn sẽ nghe đến "máy lock" và "máy quốc tế". Vậy <strong>iPhone lock là gì</strong> và có nên mua để tiết kiệm? Bài viết giúp bạn hiểu rõ trước khi quyết định.</p>

<h2>iPhone lock là gì?</h2>
<p>iPhone lock (máy khóa mạng) là máy do nhà mạng nước ngoài phân phối, bị khóa để chỉ dùng SIM của nhà mạng đó. Để dùng SIM Việt Nam, máy cần <strong>SIM ghép</strong> hoặc mã unlock. Ngược lại, <strong>bản quốc tế</strong> dùng được mọi SIM tự do.</p>

<h2>Ưu và nhược điểm của iPhone lock</h2>
<ul>
  <li><strong>Ưu điểm:</strong> giá rẻ hơn bản quốc tế cùng cấu hình, đáng kể với người ngân sách thấp.</li>
  <li><strong>Nhược điểm:</strong> phụ thuộc SIM ghép, dễ lỗi sóng, nghẽn mạng, rớt SIM sau khi cập nhật iOS; một số tính năng như iMessage, FaceTime có thể chập chờn.</li>
</ul>

<h2>Rủi ro cần cân nhắc</h2>
<ol>
  <li>Cập nhật iOS có thể làm mất kích hoạt, phải chờ SIM ghép mới hỗ trợ.</li>
  <li>Trải nghiệm sóng, cuộc gọi không ổn định bằng máy quốc tế.</li>
  <li>Giá trị bán lại thấp hơn và khó thanh khoản hơn.</li>
</ol>

<h2>Có nên mua iPhone lock không?</h2>
<p>Nếu bạn hiểu rõ hạn chế, ít cập nhật iOS và muốn tiết kiệm tối đa thì lock có thể chấp nhận được. Nhưng để dùng ổn định, bền lâu và an tâm, <strong>bản quốc tế vẫn là lựa chọn đáng tiền hơn</strong>. Tham khảo <a href="/blog/nen-mua-iphone-nao-2026">nên mua iPhone nào 2026</a> và <a href="/blog/co-nen-mua-iphone-cu-khong">có nên mua iPhone cũ không</a> để chọn máy phù hợp.</p>

<p>Tại <strong>Anh Táo Mobile</strong>, chúng tôi tư vấn minh bạch giữa máy lock và quốc tế, ưu tiên <a href="/iphone-cu">iPhone cũ</a> quốc tế nguyên zin, bảo hành rõ ràng. <a href="/dat-lich-sua-chua">Đặt lịch</a> để được tư vấn chọn máy.</p>
`,
  },
];

async function main() {
  console.log(`Seeding ${posts.length} DRAFT blog posts (published: false)...`);
  for (const p of posts) {
    await prisma.seoPage.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        h1: p.h1,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        body: p.body.trim(),
        published: false,
      },
      create: {
        slug: p.slug,
        title: p.title,
        h1: p.h1,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        body: p.body.trim(),
        published: false,
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
