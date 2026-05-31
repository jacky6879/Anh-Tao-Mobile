/**
 * backend.js - Live Supabase Client & Local Cache Fallback Pipeline (Anh Táo Mobile)
 * Extended with full CRUD write operations (Save/Edit/Delete) for products,
 * repairs, page copywriting, news blogs, and customer leads management.
 */

// 1. SUPABASE CONNECTION CONFIGURATION
// Replace these with your actual Supabase Project credentials to activate live database syncing!
const SUPABASE_URL = ""; 
const SUPABASE_ANON_KEY = ""; 

let supabase = null;

// Initialize Supabase SDK Client (Safely checks for browser loading & credentials presence)
if (typeof window.supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("⚡ [Anh Táo Mobile DB] Connected to Supabase Cloud Database Successfully!");
    } catch (err) {
        console.error("❌ [Anh Táo Mobile DB] SDK initialization failed, fell back to local offline mode.", err);
    }
} else {
    console.log("⚠️ [Anh Táo Mobile DB] Missing Supabase Credentials, running in Hybrid Local Cache Mode.");
}


// ==========================================
-- 2. OFFLINE SEED DATABASE CACHE (FALLBACKS)
// ==========================================

const PRODUCTS_SEED = [
    {
        id: 'new_ip15promax',
        name: 'iPhone 15 Pro Max 256GB - Chính hãng VNA',
        category: 'new',
        price: 29490000,
        originalPrice: 34990000,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
        rating: 5.0,
        reviews: 142,
        specs: {
            screen: '6.7 inches, Super Retina XDR OLED, 120Hz',
            cpu: 'Apple A17 Pro (3nm)',
            ram: '8 GB',
            storage: '256 GB',
            battery: '100% (Mới tinh - 4441 mAh)',
            box: 'Fullbox, cáp sạc zin, sách hướng dẫn, nguyên seal',
            warranty: '12 tháng chính hãng Apple Việt Nam',
            condition: 'Mới 100% nguyên seal'
        },
        badge: 'Bán chạy nhất'
    },
    {
        id: 'new_s24ultra',
        name: 'Samsung Galaxy S24 Ultra 256GB',
        category: 'new',
        price: 26990000,
        originalPrice: 33990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
        rating: 4.9,
        reviews: 98,
        specs: {
            screen: '6.8 inches, Dynamic AMOLED 2X, 120Hz',
            cpu: 'Snapdragon 8 Gen 3 for Galaxy',
            ram: '12 GB',
            storage: '256 GB',
            battery: '100% (Mới tinh - 5000 mAh)',
            box: 'Fullbox, cáp sạc Type-C zin, que chọc sim, nguyên seal',
            warranty: '12 tháng chính hãng Samsung Việt Nam',
            condition: 'Mới 100% nguyên seal'
        },
        badge: 'Giá hời'
    },
    {
        id: 'new_xiaomi14',
        name: 'Xiaomi 14 12GB/256GB - Chính Hãng VNA',
        category: 'new',
        price: 18490000,
        originalPrice: 22990000,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
        rating: 4.8,
        reviews: 45,
        specs: {
            screen: '6.36 inches, LTPO OLED, 120Hz, 3000 nits',
            cpu: 'Snapdragon 8 Gen 3',
            ram: '12 GB',
            storage: '256 GB',
            battery: '100% (Mới tinh - 4610 mAh)',
            box: 'Fullbox sạc nhanh 90W, ốp lưng zin, cáp Type-C',
            warranty: '18 tháng chính hãng Xiaomi Việt Nam',
            condition: 'Mới 100% nguyên seal'
        },
        badge: 'Công nghệ mới'
    },
    {
        id: 'used_ip14promax',
        name: 'iPhone 14 Pro Max 256GB - Like New 99%',
        category: 'used',
        price: 21290000,
        originalPrice: 28990000,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
        rating: 4.9,
        reviews: 320,
        specs: {
            screen: '6.7 inches, Super Retina XDR, 120Hz',
            cpu: 'Apple A16 Bionic (4nm)',
            ram: '6 GB',
            storage: '256 GB',
            battery: 'Cam kết > 89% (Chưa chai pin)',
            box: 'Cáp sạc cao cấp, tặng kèm ốp chống sốc & cường lực',
            warranty: '06 tháng AnhTáoCare bảo hành cả nguồn, màn hình',
            condition: 'Đẹp 99% không cấn móp, zin áp suất',
            badge: 'Kiểm định 15 bước'
        },
        badge: 'Kiểm định 15 bước'
    },
    {
        id: 'used_ip13pro',
        name: 'iPhone 13 Pro 128GB - Like New 99%',
        category: 'used',
        price: 13990000,
        originalPrice: 19990000,
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600',
        rating: 4.8,
        reviews: 185,
        specs: {
            screen: '6.1 inches, Super Retina XDR OLED, 120Hz',
            cpu: 'Apple A15 Bionic',
            ram: '6 GB',
            storage: '128 GB',
            battery: 'Cam kết > 88% (Zin nguyên bản)',
            box: 'Cáp sạc cao cấp, tặng cường lực & ốp chống sốc',
            warranty: '06 tháng AnhTáoCare toàn diện',
            condition: 'Ngoại hình 98.5% - 99%, zin 100%'
        },
        badge: 'Bao test 30 ngày'
    },
    {
        id: 'used_s23ultra',
        name: 'Samsung Galaxy S23 Ultra 256GB - 99%',
        category: 'used',
        price: 16490000,
        originalPrice: 24990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
        rating: 4.9,
        reviews: 112,
        specs: {
            screen: '6.8 inches, QHD+ Dynamic AMOLED 2X, 120Hz',
            cpu: 'Snapdragon 8 Gen 2 for Galaxy',
            ram: '8 GB',
            storage: '256 GB',
            battery: 'Độ chai thấp - dung lượng thực tế > 90%',
            box: 'Cáp sạc Type-C cao cấp, bút S-Pen đi kèm máy',
            warranty: '06 tháng lỗi đổi mới tuần đầu',
            condition: 'Mặt kính đẹp, viền xước nhẹ dăm 98.5%'
        },
        badge: 'Được săn đón'
    },
    {
        id: 'acc_charger20w',
        name: 'Sạc nhanh Apple 20W USB-C Power Adapter',
        category: 'accessory',
        price: 490000,
        originalPrice: 690000,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
        rating: 5.0,
        reviews: 2100,
        specs: {
            screen: 'Không có',
            cpu: 'Không có',
            ram: 'Không có',
            storage: 'Nguồn ra: 20W Power Delivery',
            battery: 'An toàn chống quá dòng, chống nhiệt',
            box: 'Củ sạc, sách hướng dẫn sử dụng',
            warranty: '12 tháng đổi mới nếu lỗi nhà sản xuất',
            condition: 'Hàng chính hãng bóc máy / nguyên hộp'
        },
        badge: 'Bắt buộc mua'
    },
    {
        id: 'acc_magsafe10k',
        name: 'Pin sạc dự phòng MagSafe Hoco 10000mAh',
        category: 'accessory',
        price: 550000,
        originalPrice: 850000,
        image: 'https://images.unsplash.com/photo-1609592424085-f5b2255b8823?auto=format&fit=crop&q=80&w=600',
        rating: 4.7,
        reviews: 320,
        specs: {
            screen: 'Đèn LED báo pin',
            cpu: 'Không có',
            ram: 'Không có',
            storage: 'Dung lượng: 10.000 mAh',
            battery: 'Lõi pin Li-Polymer siêu bền',
            box: 'Hộp sạc, cáp sạc đi kèm',
            warranty: '06 tháng lỗi 1 đổi 1',
            condition: 'Mới 100% nguyên hộp sành điệu'
        },
        badge: 'Được mua kèm nhiều'
    }
];

const REPAIRS_SEED = [
    { id: 1, device_model: 'ip15pm', service_type: 'battery', service_name: 'Thay Pin Dung Lượng Cao Pisen', price: 1490000, duration: '35 phút', warranty: '12 tháng' },
    { id: 2, device_model: 'ip15pm', service_type: 'screen', service_name: 'Thay Màn Hình Zin Cảm Ứng VNA', price: 9290000, duration: '40 phút', warranty: '06 tháng' },
    { id: 3, device_model: 'ip15pm', service_type: 'glass', service_name: 'Ép Kính Mặt Trước Cường Lực', price: 2190000, duration: '50 phút', warranty: '12 tháng' },
    { id: 4, device_model: 'ip15pm', service_type: 'faceid', service_name: 'Sửa Lỗi Mất Face ID / Camera Trước', price: 1890000, duration: '45 phút', warranty: '06 tháng' },
    { id: 5, device_model: 'ip14pm', service_type: 'battery', service_name: 'Thay Pin Dung Lượng Cao Pisen', price: 1190000, duration: '30 phút', warranty: '12 tháng' },
    { id: 6, device_model: 'ip14pm', service_type: 'screen', service_name: 'Thay Màn Hình Zin Cảm Ứng VNA', price: 7490000, duration: '40 phút', warranty: '06 tháng' },
    { id: 7, device_model: 'ip14pm', service_type: 'glass', service_name: 'Ép Kính Mặt Trước Cường Lực', price: 1690000, duration: '45 phút', warranty: '12 tháng' },
    { id: 8, device_model: 'ip14pm', service_type: 'faceid', service_name: 'Sửa Lỗi Mất Face ID / Camera Trước', price: 1490000, duration: '45 phút', warranty: '06 tháng' },
    { id: 9, device_model: 'ip13p', service_type: 'battery', service_name: 'Thay Pin Dung Lượng Cao Pisen', price: 950000, duration: '30 phút', warranty: '12 tháng' },
    { id: 10, device_model: 'ip13p', service_type: 'screen', service_name: 'Thay Màn Hình Zin Cảm Ứng VNA', price: 6200000, duration: '30 phút', warranty: '06 tháng' },
    { id: 11, device_model: 'ip13p', service_type: 'glass', service_name: 'Ép Kính Mặt Trước Cường Lực', price: 1190000, duration: '40 phút', warranty: '12 tháng' },
    { id: 12, device_model: 'ip13p', service_type: 'faceid', service_name: 'Sửa Lỗi Mất Face ID / Camera Trước', price: 1290000, duration: '35 phút', warranty: '06 tháng' },
    { id: 13, device_model: 'ip12pm', service_type: 'battery', service_name: 'Thay Pin Dung Lượng Cao Pisen', price: 790000, duration: '30 phút', warranty: '12 tháng' },
    { id: 14, device_model: 'ip12pm', service_type: 'screen', service_name: 'Thay Màn Hình Zin Cảm Ứng VNA', price: 4290000, duration: '30 phút', warranty: '06 tháng' },
    { id: 15, device_model: 'ip12pm', service_type: 'glass', service_name: 'Ép Kính Mặt Trước Cường Lực', price: 990000, duration: '40 phút', warranty: '12 tháng' },
    { id: 16, device_model: 'ip12pm', service_type: 'faceid', service_name: 'Sửa Lỗi Mất Face ID / Camera Trước', price: 990000, duration: '35 phút', warranty: '06 tháng' },
    { id: 17, device_model: 'ip11pm', service_type: 'battery', service_name: 'Thay Pin Dung Lượng Cao Pisen', price: 650000, duration: '25 phút', warranty: '12 tháng' },
    { id: 18, device_model: 'ip11pm', service_type: 'screen', service_name: 'Thay Màn Hình Zin Cảm Ứng VNA', price: 2900000, duration: '30 phút', warranty: '06 tháng' },
    { id: 19, device_model: 'ip11pm', service_type: 'glass', service_name: 'Ép Kính Mặt Trước Cường Lực', price: 790000, duration: '40 phút', warranty: '12 tháng' },
    { id: 20, device_model: 'ip11pm', service_type: 'faceid', service_name: 'Sửa Lỗi Mất Face ID / Camera Trước', price: 890000, duration: '35 phút', warranty: '06 tháng' }
];

const PAGE_CONTENT_SEED = {
    hero_title_1: 'iPhone 15 Pro Max',
    hero_title_2: 'Likenew Như Mới',
    hero_desc: 'Bản quốc tế zin áp suất, cam kết chưa qua sửa chữa. Kiểm định 15 bước khắt khe bởi chuyên gia kỹ thuật Anh Táo Mobile.',
    hotline: '1900.6822',
    hotline_repair: '0987.654.321',
    email: 'support@anhtaomobile.vn',
    address: '1013 CMT8, Thủ Dầu Một, Bình Dương',
    footer_desc: 'Chuỗi hệ thống kiểm định điện thoại qua sử dụng số 1 Việt Nam. Đem những chiếc Flagship Like new tiệm cận sự hoàn hảo nhất đến tay khách hàng.'
};

const BLOGS_SEED = [
    {
        id: 1,
        title: '5 Mẹo chọn mua iPhone cũ nguyên bản, tránh xa hàng dựng kém chất lượng',
        category: 'Cẩm Nang Mua Sắm',
        published_date: '28/05/2026',
        thumbnail_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600',
        brief: 'Làm thế nào để phân biệt màn hình lô, vỏ thay hay máy đã bị sửa mainboard? Cùng xem 5 bước kiểm tra nhanh được chia sẻ từ kĩ thuật viên trưởng tại Anh Táo Mobile...',
        content: 'Mua iPhone cũ đã qua sử dụng luôn tiềm ẩn nhiều rủi ro. Dưới đây là 5 mẹo được đúc kết từ kĩ thuật viên trưởng tại Anh Táo Mobile giúp bạn dễ dàng chọn được máy nguyên bản chuẩn zin:\n\n1. Kiểm tra ốc vít đáy và các cổng kết nối: Ốc đáy phải phẳng, các rãnh ốc sắc cạnh và chưa có dấu hiệu bị cọ sát nhiều bởi tua-vít.\n2. Kiểm tra áp suất chống nước: Sử dụng phần mềm chuyên dụng đo sự chênh lệch áp suất khi bấm nhẹ lên màn hình. Máy zin nguyên bản luôn giữ áp suất tốt.\n3. Soi màn hình hiển thị: Màn hình lô thường hiển thị ám xanh lục hoặc phản quang không đều. Hãy bật tính năng True Tone để xem màn có chính hãng không.\n4. Rà soát chẩn đoán của hệ thống (Diagnostic Log): Vào mục Cài đặt -> Quyền riêng tư -> Phân tích để đọc log. Tránh xa các máy có chứa từ khóa \'Panic Full\' hoặc \'Reset Peer\' - đây là dấu hiệu phần cứng lỗi nặng.\n5. Test cảm ứng & Điểm chết: Giữ một icon ứng dụng và di chuyển đều khắp màn hình để phát hiện xem có điểm nào bị liệt hay phản hồi kém không.'
    },
    {
        id: 2,
        title: 'Đánh giá hiệu năng chơi game trên iPhone 15 Pro Max sau 6 tháng ra mắt',
        category: 'Đánh Giá Chi Tiết',
        published_date: '25/05/2026',
        thumbnail_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
        brief: 'Trải nghiệm tựa game nặng Genshin Impact và Resident Evil 4 trên vi xử lý A17 Pro 3nm đầu tiên thế giới. Liệu nhiệt độ máy có còn nóng như tin đồn ban đầu?',
        content: 'Chiếc Flagship đầu bảng của Apple sở hữu chip A17 Pro (tiêu chuẩn 3nm đầu tiên thế giới). Cùng nhìn lại sức mạnh thực tế sau 6 tháng ra mắt:\n\n- FPS mượt mà: Các tựa game FPS như PUBG Mobile hay Liên Quân luôn duy trì mức 60 - 120 FPS ổn định, mượt mà mà không hề giật lag.\n- Nhiệt độ tối ưu: Sau các bản cập nhật iOS 17.4 trở lên, hiện tượng quá nhiệt đột ngột khi sạc đã được khắc phục hoàn chỉnh. Nhiệt độ tối qua khi chơi game nặng Genshin Impact duy trì khoảng 41 - 42.5 độ C.\n- Thời lượng pin vượt mong đợi: Lõi pin dung lượng lớn kết hợp chip xử lý tiết kiệm điện năng cho phép chơi game liên tục lên tới 5.5 - 6 tiếng.'
    },
    {
        id: 3,
        title: 'Quy trình ép kính màn hình điện thoại iPhone tiêu chuẩn bụi mịn Class 100',
        category: 'Quy Trình Sửa Chữa',
        published_date: '20/05/2026',
        thumbnail_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
        brief: 'Khám phá toàn bộ quy trình bóc tách kính vỡ màn hình OLED, vệ sinh keo OCA quang học và ép khuôn chân không tự động khép kín hoàn hảo diễn ra tại phòng kỹ thuật...',
        content: 'Tại Anh Táo Mobile, quy trình ép kính thay kính vỡ iPhone được áp dụng theo quy chuẩn khép kín chống bụi mịn tuyệt đối:\n\nBước 1: Tháo dỡ cụm màn hình, tháo các gioăng đệm.\nBước 2: Sử dụng dây cắt thép siêu mịn để lọc bỏ lớp kính vỡ ra khỏi tấm nền hiển thị OLED dưới bàn nhiệt nhiệt độ ổn định.\nBước 3: Vệ sinh lớp keo LOCA cũ bằng hóa chất chuyên dụng tẩy keo không gây xước phim màn.\nBước 4: Sử dụng keo OCA cao cấp đặt kính mới, đưa vào buồng ép chân không tự động áp suất cao.\nBước 5: Cho màn hình vào buồng hấp khử bọt khí Autoclave trong vòng 10 phút để loại bỏ 100% bọt li ti.\nBước 6: Lắp đặt hoàn tất gioăng cao su kháng nước mới và kiểm tra lại cảm ứng.'
    }
];

// ==========================================
-- 3. PERSISTENT LOCAL STORAGE EMULATOR INIT
// ==========================================

function initLocalStorageBuffers() {
    if (!localStorage.getItem('vibemobile_leads')) {
        localStorage.setItem('vibemobile_leads', JSON.stringify([]));
    }
    if (!localStorage.getItem('vibemobile_products')) {
        localStorage.setItem('vibemobile_products', JSON.stringify(PRODUCTS_SEED));
    }
    if (!localStorage.getItem('vibemobile_repairs')) {
        localStorage.setItem('vibemobile_repairs', JSON.stringify(REPAIRS_SEED));
    }
    if (!localStorage.getItem('vibemobile_content')) {
        localStorage.setItem('vibemobile_content', JSON.stringify(PAGE_CONTENT_SEED));
    }
    if (!localStorage.getItem('vibemobile_blogs')) {
        localStorage.setItem('vibemobile_blogs', JSON.stringify(BLOGS_SEED));
    }
    console.log("⚡ [Anh Táo Mobile DB] Emulated Local Storage Buffers verified.");
}
initLocalStorageBuffers();


// ==========================================
-- 4. DYNAMIC READ API METHOD OVERRIDES
// ==========================================

// Fetch all active products
async function fetchProducts() {
    if (supabase) {
        try {
            console.log("🔗 [Supabase API] Fetching products...");
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('price', { ascending: false });
            
            if (error) throw error;
            if (data && data.length > 0) {
                // Map database columns to app-specific nested specs key
                return data.map(item => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    price: Number(item.price),
                    originalPrice: Number(item.original_price),
                    image: item.image,
                    rating: Number(item.rating),
                    reviews: item.reviews,
                    badge: item.badge,
                    specs: {
                        screen: item.specs_screen || 'Đang cập nhật',
                        cpu: item.specs_cpu || 'Đang cập nhật',
                        ram: item.specs_ram || 'Đang cập nhật',
                        storage: item.specs_storage || 'Đang cập nhật',
                        battery: item.specs_battery || 'Đang cập nhật',
                        box: item.specs_box || 'Đang cập nhật',
                        warranty: item.specs_warranty || 'Đang cập nhật',
                        condition: item.specs_condition || 'Đang cập nhật'
                    }
                }));
            }
        } catch (err) {
            console.warn("⚠️ [Supabase API] Error fetching products, fell back to local cache:", err.message);
        }
    }
    // Return local cache array
    return JSON.parse(localStorage.getItem('vibemobile_products')) || PRODUCTS_SEED;
}

// Fetch all repair service prices
async function fetchRepairs() {
    if (supabase) {
        try {
            console.log("🔗 [Supabase API] Fetching repairs matrix...");
            const { data, error } = await supabase
                .from('repairs')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) throw error;
            if (data && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.warn("⚠️ [Supabase API] Error fetching repairs, fell back to local cache:", err.message);
        }
    }
    return JSON.parse(localStorage.getItem('vibemobile_repairs')) || REPAIRS_SEED;
}

// Fetch landing page texts and hotlines
async function fetchPageContent() {
    let contentMap = { ...PAGE_CONTENT_SEED };
    if (supabase) {
        try {
            console.log("🔗 [Supabase API] Fetching page content copy...");
            const { data, error } = await supabase
                .from('page_content')
                .select('*');
            
            if (error) throw error;
            if (data && data.length > 0) {
                data.forEach(row => {
                    contentMap[row.key] = row.value;
                });
                return contentMap;
            }
        } catch (err) {
            console.warn("⚠️ [Supabase API] Error fetching page content, fell back to local cache:", err.message);
        }
    }
    return JSON.parse(localStorage.getItem('vibemobile_content')) || PAGE_CONTENT_SEED;
}

// Fetch all active tech blogs
async function fetchBlogs() {
    if (supabase) {
        try {
            console.log("🔗 [Supabase API] Fetching blogs...");
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) throw error;
            if (data && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.warn("⚠️ [Supabase API] Error fetching blogs, fell back to local cache:", err.message);
        }
    }
    return JSON.parse(localStorage.getItem('vibemobile_blogs')) || BLOGS_SEED;
}

// Fetch captured customer leads
async function fetchLeads() {
    if (supabase) {
        try {
            console.log("🔗 [Supabase API] Fetching leads logs...");
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (data) return data;
        } catch (err) {
            console.warn("⚠️ [Supabase API] Error fetching leads, fell back to local cache:", err.message);
        }
    }
    return JSON.parse(localStorage.getItem('vibemobile_leads')) || [];
}


// ==========================================
-- 5. WRITE CRUD OPERATIONS (ADMIN SERVICES)
// ==========================================

// Save or Update Product
async function saveProduct(prod) {
    console.group("🚀 [CRUD Write] Save Product");
    console.log("Product Payload:", prod);
    
    // 1. Sync to local storage emulator buffer
    const localProds = JSON.parse(localStorage.getItem('vibemobile_products')) || PRODUCTS_SEED;
    const existingIdx = localProds.findIndex(p => p.id === prod.id);
    
    if (existingIdx > -1) {
        localProds[existingIdx] = prod;
    } else {
        localProds.push(prod);
    }
    localStorage.setItem('vibemobile_products', JSON.stringify(localProds));

    let dbSynced = false;

    // 2. Sync to live Supabase DB
    if (supabase) {
        try {
            console.log("🔗 [Supabase DB] Upserting product row...");
            const { error } = await supabase
                .from('products')
                .upsert([{
                    id: prod.id,
                    name: prod.name,
                    category: prod.category,
                    price: prod.price,
                    original_price: prod.originalPrice,
                    image: prod.image,
                    rating: prod.rating,
                    reviews: prod.reviews,
                    badge: prod.badge,
                    specs_screen: prod.specs.screen,
                    specs_cpu: prod.specs.cpu,
                    specs_ram: prod.specs.ram,
                    specs_storage: prod.specs.storage,
                    specs_battery: prod.specs.battery,
                    specs_box: prod.specs.box,
                    specs_warranty: prod.specs.warranty,
                    specs_condition: prod.specs.condition
                }]);
            
            if (error) throw error;
            dbSynced = true;
            console.log("✓ [Supabase DB] Product upserted successfully.");
        } catch (err) {
            console.warn("⚠️ [Supabase DB] Upsert failed, using offline cache fallback:", err.message);
        }
    }
    console.groupEnd();
    return { success: true, synced: dbSynced };
}

// Delete Product
async function deleteProduct(productId) {
    console.group("🚀 [CRUD Delete] Delete Product ID:", productId);
    
    // 1. Sync to local storage emulator buffer
    const localProds = JSON.parse(localStorage.getItem('vibemobile_products')) || PRODUCTS_SEED;
    const updated = localProds.filter(p => p.id !== productId);
    localStorage.setItem('vibemobile_products', JSON.stringify(updated));

    let dbSynced = false;

    // 2. Sync to live Supabase DB
    if (supabase) {
        try {
            console.log("🔗 [Supabase DB] Deleting product row...");
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);
            
            if (error) throw error;
            dbSynced = true;
            console.log("✓ [Supabase DB] Product deleted successfully.");
        } catch (err) {
            console.warn("⚠️ [Supabase DB] Delete failed, using offline cache:", err.message);
        }
    }
    console.groupEnd();
    return { success: true, synced: dbSynced };
}

// Update Repair Price Row
async function saveRepair(row) {
    console.group("🚀 [CRUD Write] Save Repair Price Row");
    
    // 1. Sync to local storage emulator
    const localRepairs = JSON.parse(localStorage.getItem('vibemobile_repairs')) || REPAIRS_SEED;
    const idx = localRepairs.findIndex(r => r.device_model === row.device_model && r.service_type === row.service_type);
    
    if (idx > -1) {
        localRepairs[idx] = { ...localRepairs[idx], ...row };
    } else {
        row.id = localRepairs.length + 1;
        localRepairs.push(row);
    }
    localStorage.setItem('vibemobile_repairs', JSON.stringify(localRepairs));

    let dbSynced = false;

    // 2. Sync to live Supabase DB
    if (supabase) {
        try {
            console.log("🔗 [Supabase DB] Upserting repair price row...");
            // Query by ID if present, otherwise query by model + type
            const payload = {
                device_model: row.device_model,
                service_type: row.service_type,
                service_name: row.service_name,
                price: row.price,
                duration: row.duration,
                warranty: row.warranty
            };
            if (row.id) payload.id = row.id;

            const { error } = await supabase
                .from('repairs')
                .upsert([payload]);
            
            if (error) throw error;
            dbSynced = true;
            console.log("✓ [Supabase DB] Repair upserted successfully.");
        } catch (err) {
            console.warn("⚠️ [Supabase DB] Repair upsert failed, using offline cache:", err.message);
        }
    }
    console.groupEnd();
    return { success: true, synced: dbSynced };
}

// Save Page Content Overwrite
async function savePageContent(key, value) {
    console.group("🚀 [CRUD Write] Save Page Content Key:", key);
    
    // 1. Sync to local storage
    const localContent = JSON.parse(localStorage.getItem('vibemobile_content')) || PAGE_CONTENT_SEED;
    localContent[key] = value;
    localStorage.setItem('vibemobile_content', JSON.stringify(localContent));

    let dbSynced = false;

    // 2. Sync to live Supabase
    if (supabase) {
        try {
            console.log("🔗 [Supabase DB] Upserting page_content copy...");
            const { error } = await supabase
                .from('page_content')
                .upsert([{ key, value }]);
            
            if (error) throw error;
            dbSynced = true;
            console.log("✓ [Supabase DB] Page content key saved successfully.");
        } catch (err) {
            console.warn("⚠️ [Supabase DB] Content upsert failed, using offline cache:", err.message);
        }
    }
    console.groupEnd();
    return { success: true, synced: dbSynced };
}

// Save/Publish Blog Post
async function saveBlog(blog) {
    console.group("🚀 [CRUD Write] Publish Blog Post");
    
    // 1. Sync to local storage
    const localBlogs = JSON.parse(localStorage.getItem('vibemobile_blogs')) || BLOGS_SEED;
    if (!blog.id) {
        blog.id = localBlogs.length + 1;
        localBlogs.push(blog);
    } else {
        const idx = localBlogs.findIndex(b => b.id == blog.id);
        if (idx > -1) localBlogs[idx] = blog;
    }
    localStorage.setItem('vibemobile_blogs', JSON.stringify(localBlogs));

    let dbSynced = false;

    // 2. Sync to live Supabase DB
    if (supabase) {
        try {
            console.log("🔗 [Supabase DB] Inserting blog post...");
            const { error } = await supabase
                .from('blogs')
                .insert([{
                    title: blog.title,
                    category: blog.category,
                    published_date: blog.published_date,
                    thumbnail_url: blog.thumbnail_url,
                    brief: blog.brief,
                    content: blog.content
                }]);
            
            if (error) throw error;
            dbSynced = true;
            console.log("✓ [Supabase DB] Blog published successfully.");
        } catch (err) {
            console.warn("⚠️ [Supabase DB] Blog insert failed, using offline cache:", err.message);
        }
    }
    console.groupEnd();
    return { success: true, synced: dbSynced };
}

// Clear Leads Database
async function clearLeads() {
    localStorage.setItem('vibemobile_leads', JSON.stringify([]));
    
    if (supabase) {
        try {
            console.log("🔗 [Supabase DB] Deleting all leads rows...");
            const { error } = await supabase
                .from('leads')
                .delete()
                .gt('id', 0); // Deletes all rows safely
            if (error) throw error;
        } catch (err) {
            console.warn("⚠️ [Supabase DB] Live clear failed:", err.message);
        }
    }
    return true;
}


// ==========================================
-- 6. LEADS INSERTION PIPELINE (FORM API)
// ==========================================

class DatabaseLeadController {
    async insertLead(leadData) {
        console.group("🚀 [API POST] Submit customer lead to database");
        console.log("Payload:", leadData);

        // Always save locally to ensure 100% data preservation
        const leads = JSON.parse(localStorage.getItem('vibemobile_leads')) || [];
        const newLead = {
            id: 'lead_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'Pending',
            ...leadData
        };
        leads.push(newLead);
        localStorage.setItem('vibemobile_leads', JSON.stringify(leads));

        let supabaseSuccess = false;

        // If Supabase client is active, insert a live DB record!
        if (supabase) {
            try {
                console.log("🔗 [Supabase DB] Inserting row into 'leads' table...");
                const { error } = await supabase
                    .from('leads')
                    .insert([{
                        customer_name: leadData.customerName,
                        phone: leadData.phone,
                        product_id: leadData.productId,
                        product_name: leadData.productName,
                        price: leadData.price,
                        installment_term: leadData.installmentTerm,
                        monthly_payment: leadData.monthlyPayment,
                        status: 'Pending'
                    }]);
                
                if (error) throw error;
                supabaseSuccess = true;
                console.log("✓ [Supabase DB] Lead row inserted successfully.");
            } catch (err) {
                console.warn("⚠️ [Supabase DB] Live insert failed, lead saved in local storage:", err.message);
            }
        }

        console.log("Local Database sync ok. Client payload processed.");
        console.groupEnd();
        
        return { 
            success: true, 
            lead: newLead, 
            synced: supabaseSuccess 
        };
    }
}

const mockDB = new DatabaseLeadController();


// ==========================================
-- 7. UTILITIES & CALCULATORS
// ==========================================

// 0% Installment calculator
function calculateInstallment(totalPrice, termMonths) {
    const conversionFeeRate = 0.02; // Small 2% processing conversion fee
    
    const baseMonthlyPayment = Math.round(totalPrice / termMonths);
    const conversionFee = Math.round(totalPrice * conversionFeeRate);
    
    return {
        term: termMonths,
        monthlyPrincipal: baseMonthlyPayment,
        conversionFee: conversionFee,
        monthlyTotal: baseMonthlyPayment,
        firstMonthTotal: baseMonthlyPayment + conversionFee,
        totalPayable: totalPrice + conversionFee
    };
}

// Napas Standard VietQR generation Link
function generateVietQR(amount, description, accountNo = "19033481234567", bankId = "Techcombank") {
    const descEncoded = encodeURIComponent(description);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${descEncoded}&accountName=ANH%20TAO%20MOBILE`;
}
