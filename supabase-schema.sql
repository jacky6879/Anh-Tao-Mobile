-- supabase-schema.sql
-- Anh Tao Mobile Production Database Schema
-- Copy and paste this script directly into the Supabase SQL Editor to initialize your database.

-- 1. DROP EXISTING TABLES (IF ANY)
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS page_content CASCADE;
DROP TABLE IF EXISTS repairs CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. CREATE PRODUCTS TABLE
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('new', 'used', 'accessory')),
    price BIGINT NOT NULL,
    original_price BIGINT NOT NULL,
    image TEXT NOT NULL,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    reviews INTEGER NOT NULL DEFAULT 0,
    specs_screen TEXT,
    specs_cpu TEXT,
    specs_ram TEXT,
    specs_storage TEXT,
    specs_battery TEXT,
    specs_box TEXT,
    specs_warranty TEXT,
    specs_condition TEXT,
    badge TEXT DEFAULT 'Bán chạy nhất'
);

-- Enable RLS & Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);

-- 3. CREATE REPAIRS TABLE
CREATE TABLE repairs (
    id SERIAL PRIMARY KEY,
    device_model TEXT NOT NULL CHECK (device_model IN ('ip15pm', 'ip14pm', 'ip13p', 'ip12pm', 'ip11pm')),
    service_type TEXT NOT NULL CHECK (service_type IN ('battery', 'screen', 'glass', 'faceid')),
    service_name TEXT NOT NULL,
    price BIGINT NOT NULL,
    duration TEXT NOT NULL DEFAULT '30 phút',
    warranty TEXT NOT NULL DEFAULT '06 tháng'
);

-- Enable RLS & Policies
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to repairs" ON repairs FOR SELECT USING (true);

-- 4. CREATE PAGE CONTENT TABLE
CREATE TABLE page_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Enable RLS & Policies
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to page_content" ON page_content FOR SELECT USING (true);

-- 5. CREATE BLOGS TABLE
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    published_date TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    brief TEXT NOT NULL,
    content TEXT NOT NULL
);

-- Enable RLS & Policies
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to blogs" ON blogs FOR SELECT USING (true);

-- 6. CREATE LEADS TABLE (FORM CAPTURES)
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    price BIGINT DEFAULT 0,
    installment_term TEXT,
    monthly_payment BIGINT DEFAULT 0,
    status TEXT DEFAULT 'Pending'
);

-- Enable RLS & Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read to leads" ON leads FOR SELECT TO authenticated USING (true);


-- ==========================================
-- 7. SEED DATA GENERATOR
-- ==========================================

-- Seed Products (Core Inventory)
INSERT INTO products (id, name, category, price, original_price, image, rating, reviews, specs_screen, specs_cpu, specs_ram, specs_storage, specs_battery, specs_box, specs_warranty, specs_condition, badge) VALUES
('new_ip15promax', 'iPhone 15 Pro Max 256GB - Chính hãng VNA', 'new', 29490000, 34990000, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600', 5.0, 142, '6.7 inches, Super Retina XDR OLED, 120Hz', 'Apple A17 Pro (3nm)', '8 GB', '256 GB', '100% (Mới tinh - 4441 mAh)', 'Fullbox, cáp sạc zin, sách hướng dẫn, nguyên seal', '12 tháng chính hãng Apple Việt Nam', 'Mới 100% nguyên seal', 'Bán chạy nhất'),
('new_s24ultra', 'Samsung Galaxy S24 Ultra 256GB', 'new', 26990000, 33990000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600', 4.9, 98, '6.8 inches, Dynamic AMOLED 2X, 120Hz', 'Snapdragon 8 Gen 3 for Galaxy', '12 GB', '256 GB', '100% (Mới tinh - 5000 mAh)', 'Fullbox, cáp sạc Type-C zin, que chọc sim, nguyên seal', '12 tháng chính hãng Samsung Việt Nam', 'Mới 100% nguyên seal', 'Giá hời'),
('new_xiaomi14', 'Xiaomi 14 12GB/256GB - Chính Hãng VNA', 'new', 18490000, 22990000, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600', 4.8, 45, '6.36 inches, LTPO OLED, 120Hz, 3000 nits', 'Snapdragon 8 Gen 3', '12 GB', '256 GB', '100% (Mới tinh - 4610 mAh)', 'Fullbox sạc nhanh 90W, ốp lưng zin, cáp Type-C', '18 tháng chính hãng Xiaomi Việt Nam', 'Mới 100% nguyên seal', 'Công nghệ mới'),
('used_ip14promax', 'iPhone 14 Pro Max 256GB - Like New 99%', 'used', 21290000, 28990000, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600', 4.9, 320, '6.7 inches, Super Retina XDR, 120Hz', 'Apple A16 Bionic (4nm)', '6 GB', '256 GB', 'Cam kết > 89% (Chưa chai pin)', 'Cáp sạc cao cấp, tặng kèm ốp chống sốc & cường lực', '06 tháng AnhTáoCare bảo hành cả nguồn, màn hình', 'Đẹp 99% không cấn móp, zin áp suất', 'Kiểm định 15 bước'),
('used_ip13pro', 'iPhone 13 Pro 128GB - Like New 99%', 'used', 13990000, 19990000, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600', 4.8, 185, '6.1 inches, Super Retina XDR OLED, 120Hz', 'Apple A15 Bionic', '6 GB', '128 GB', 'Cam kết > 88% (Zin nguyên bản)', 'Cáp sạc cao cấp, tặng cường lực & ốp chống sốc', '06 tháng AnhTáoCare toàn diện', 'Ngoại hình 98.5% - 99%, zin 100%', 'Bao test 30 ngày'),
('used_s23ultra', 'Samsung Galaxy S23 Ultra 256GB - 99%', 'used', 16490000, 24990000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600', 4.9, 112, '6.8 inches, QHD+ Dynamic AMOLED 2X, 120Hz', 'Snapdragon 8 Gen 2 for Galaxy', '8 GB', '256 GB', 'Độ chai thấp - dung lượng thực tế > 90%', 'Cáp sạc Type-C cao cấp, bút S-Pen đi kèm máy', '06 tháng lỗi đổi mới tuần đầu', 'Mặt kính đẹp, viền xước nhẹ dăm 98.5%', 'Được săn đón'),
('acc_charger20w', 'Sạc nhanh Apple 20W USB-C Power Adapter', 'accessory', 490000, 690000, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600', 5.0, 2100, 'Không có', 'Không có', 'Không có', 'Nguồn ra: 20W Power Delivery', 'An toàn chống quá dòng, chống nhiệt', 'Củ sạc, sách hướng dẫn sử dụng', '12 tháng đổi mới nếu lỗi nhà sản xuất', 'Hàng chính hãng bóc máy / nguyên hộp', 'Bắt buộc mua'),
('acc_magsafe10k', 'Pin sạc dự phòng MagSafe Hoco 10000mAh', 'accessory', 550000, 850000, 'https://images.unsplash.com/photo-1609592424085-f5b2255b8823?auto=format&fit=crop&q=80&w=600', 4.7, 320, 'Đèn LED báo pin', 'Không có', 'Không có', 'Dung lượng: 10.000 mAh', 'Lõi pin Li-Polymer siêu bền', 'Hộp sạc, cáp sạc đi kèm', '06 tháng lỗi 1 đổi 1', 'Mới 100% nguyên hộp sành điệu', 'Được mua kèm nhiều');

-- Seed Repairs (Prices matrix)
INSERT INTO repairs (device_model, service_type, service_name, price, duration, warranty) VALUES
('ip15pm', 'battery', 'Thay Pin Dung Lượng Cao Pisen', 1490000, '35 phút', '12 tháng'),
('ip15pm', 'screen', 'Thay Màn Hình Zin Cảm Ứng VNA', 9290000, '40 phút', '06 tháng'),
('ip15pm', 'glass', 'Ép Kính Mặt Trước Cường Lực', 2190000, '50 phút', '12 tháng'),
('ip15pm', 'faceid', 'Sửa Lỗi Mất Face ID / Camera Trước', 1890000, '45 phút', '06 tháng'),
('ip14pm', 'battery', 'Thay Pin Dung Lượng Cao Pisen', 1190000, '30 phút', '12 tháng'),
('ip14pm', 'screen', 'Thay Màn Hình Zin Cảm Ứng VNA', 7490000, '40 phút', '06 tháng'),
('ip14pm', 'glass', 'Ép Kính Mặt Trước Cường Lực', 1690000, '45 phút', '12 tháng'),
('ip14pm', 'faceid', 'Sửa Lỗi Mất Face ID / Camera Trước', 1490000, '45 phút', '06 tháng'),
('ip13p', 'battery', 'Thay Pin Dung Lượng Cao Pisen', 950000, '30 phút', '12 tháng'),
('ip13p', 'screen', 'Thay Màn Hình Zin Cảm Ứng VNA', 6200000, '30 phút', '06 tháng'),
('ip13p', 'glass', 'Ép Kính Mặt Trước Cường Lực', 1190000, '40 phút', '12 tháng'),
('ip13p', 'faceid', 'Sửa Lỗi Mất Face ID / Camera Trước', 1290000, '35 phút', '06 tháng'),
('ip12pm', 'battery', 'Thay Pin Dung Lượng Cao Pisen', 790000, '30 phút', '12 tháng'),
('ip12pm', 'screen', 'Thay Màn Hình Zin Cảm Ứng VNA', 4290000, '30 phút', '06 tháng'),
('ip12pm', 'glass', 'Ép Kính Mặt Trước Cường Lực', 990000, '40 phút', '12 tháng'),
('ip12pm', 'faceid', 'Sửa Lỗi Mất Face ID / Camera Trước', 990000, '35 phút', '06 tháng'),
('ip11pm', 'battery', 'Thay Pin Dung Lượng Cao Pisen', 650000, '25 phút', '12 tháng'),
('ip11pm', 'screen', 'Thay Màn Hình Zin Cảm Ứng VNA', 2900000, '30 phút', '06 tháng'),
('ip11pm', 'glass', 'Ép Kính Mặt Trước Cường Lực', 790000, '40 phút', '12 tháng'),
('ip11pm', 'faceid', 'Sửa Lỗi Mất Face ID / Camera Trước', 890000, '35 phút', '06 tháng');

-- Seed Page Content (Dynamic Copywriting & Coordinates)
INSERT INTO page_content (key, value) VALUES
('hero_title_1', 'iPhone 15 Pro Max'),
('hero_title_2', 'Likenew Như Mới'),
('hero_desc', 'Bản quốc tế zin áp suất, cam kết chưa qua sửa chữa. Kiểm định 15 bước khắt khe bởi chuyên gia kỹ thuật Anh Táo Mobile.'),
('hotline', '08 1900 0011'),
('hotline_repair', '0987.654.321'),
('email', 'support@anhtaomobile.vn'),
('address', '1013 CMT8, P. Thủ Dầu Một, Hồ Chí Minh'),
('maps_url', 'https://maps.app.goo.gl/DExvRVg5SqceADN19'),
('footer_desc', 'Chuỗi hệ thống kiểm định điện thoại qua sử dụng số 1 Việt Nam. Đem những chiếc Flagship Like new tiệm cận sự hoàn hảo nhất đến tay khách hàng.');

-- Seed Blogs (Tech Articles)
INSERT INTO blogs (title, category, published_date, thumbnail_url, brief, content) VALUES
('5 Mẹo chọn mua iPhone cũ nguyên bản, tránh xa hàng dựng kém chất lượng', 'Cẩm Nang Mua Sắm', '28/05/2026', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600', 'Làm thế nào để phân biệt màn hình lô, vỏ thay hay máy đã bị sửa mainboard? Cùng xem 5 bước kiểm tra nhanh được chia sẻ từ kĩ thuật viên trưởng tại Anh Táo Mobile...', 'Mua iPhone cũ đã qua sử dụng luôn tiềm ẩn nhiều rủi ro. Dưới đây là 5 mẹo được đúc kết từ kĩ thuật viên trưởng tại Anh Táo Mobile giúp bạn dễ dàng chọn được máy nguyên bản chuẩn zin:\n\n1. Kiểm tra ốc vít đáy và các cổng kết nối: Ốc đáy phải phẳng, các rãnh ốc sắc cạnh và chưa có dấu hiệu bị cọ sát nhiều bởi tua-vít.\n2. Kiểm tra áp suất chống nước: Sử dụng phần mềm chuyên dụng đo sự chênh lệch áp suất khi bấm nhẹ lên màn hình. Máy zin nguyên bản luôn giữ áp suất tốt.\n3. Soi màn hình hiển thị: Màn hình lô thường hiển thị ám xanh lục hoặc phản quang không đều. Hãy bật tính năng True Tone để xem màn có chính hãng không.\n4. Rà soát chẩn đoán của hệ thống (Diagnostic Log): Vào mục Cài đặt -> Quyền riêng tư -> Phân tích để đọc log. Tránh xa các máy có chứa từ khóa ''Panic Full'' hoặc ''Reset Peer'' - đây là dấu hiệu phần cứng lỗi nặng.\n5. Test cảm ứng & Điểm chết: Giữ một icon ứng dụng và di chuyển đều khắp màn hình để phát hiện xem có điểm nào bị liệt hay phản hồi kém không.'),
('Đánh giá hiệu năng chơi game trên iPhone 15 Pro Max sau 6 tháng ra mắt', 'Đánh Giá Chi Tiết', '25/05/2026', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600', 'Trải nghiệm tựa game nặng Genshin Impact và Resident Evil 4 trên vi xử lý A17 Pro 3nm đầu tiên thế giới. Liệu nhiệt độ máy có còn nóng như tin đồn ban đầu?', 'Chiếc Flagship đầu bảng của Apple sở hữu chip A17 Pro (tiêu chuẩn 3nm đầu tiên thế giới). Cùng nhìn lại sức mạnh thực tế sau 6 tháng ra mắt:\n\n- FPS mượt mà: Các tựa game FPS như PUBG Mobile hay Liên Quân luôn duy trì mức 60 - 120 FPS ổn định, mượt mà mà không hề giật lag.\n- Nhiệt độ tối ưu: Sau các bản cập nhật iOS 17.4 trở lên, hiện tượng quá nhiệt đột ngột khi sạc đã được khắc phục hoàn chỉnh. Nhiệt độ tối qua khi chơi game nặng Genshin Impact duy trì khoảng 41 - 42.5 độ C.\n- Thời lượng pin vượt mong đợi: Lõi pin dung lượng lớn kết hợp chip xử lý tiết kiệm điện năng cho phép chơi game liên tục lên tới 5.5 - 6 tiếng.'),
('Quy trình ép kính màn hình điện thoại iPhone tiêu chuẩn bụi mịn Class 100', 'Quy Trình Sửa Chữa', '20/05/2026', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600', 'Khám phá toàn bộ quy trình bóc tách kính vỡ màn hình OLED, vệ sinh keo OCA quang học và ép khuôn chân không tự động khép kín hoàn hảo diễn ra tại phòng kỹ thuật...', 'Tại Anh Táo Mobile, quy trình ép kính thay kính vỡ iPhone được áp dụng theo quy chuẩn khép kín chống bụi mịn tuyệt đối:\n\nBước 1: Tháo dỡ cụm màn hình, tháo các gioăng đệm.\nBước 2: Sử dụng dây cắt thép siêu mịn để lọc bỏ lớp kính vỡ ra khỏi tấm nền hiển thị OLED dưới bàn nhiệt nhiệt độ ổn định.\nBước 3: Vệ sinh lớp keo LOCA cũ bằng hóa chất chuyên dụng tẩy keo không gây xước phim màn.\nBước 4: Sử dụng keo OCA cao cấp đặt kính mới, đưa vào buồng ép chân không tự động áp suất cao.\nBước 5: Cho màn hình vào buồng hấp khử bọt khí Autoclave trong vòng 10 phút để loại bỏ 100% bọt li ti.\nBước 6: Lắp đặt hoàn tất gioăng cao su kháng nước mới và kiểm tra lại cảm ứng.');
