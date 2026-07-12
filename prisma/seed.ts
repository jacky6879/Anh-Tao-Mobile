import { prisma } from "../src/lib/db";
import { ProductCondition, ProductStatus } from "@prisma/client";

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

async function main() {
  console.log("Seeding Anh Táo Mobile...");

  // Categories
  const categories = [
    { name: "iPhone", icon: "smartphone", order: 1 },
    { name: "iPad", icon: "tablet", order: 2 },
    { name: "MacBook", icon: "laptop", order: 3 },
    { name: "Smartphone Android", icon: "smartphone", order: 4 },
    { name: "Apple Watch", icon: "watch", order: 5 },
    { name: "AirPods", icon: "earphones", order: 6 },
    { name: "Phụ kiện", icon: "plug", order: 7 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: {},
      create: { ...c, slug: slugify(c.name) },
    });
  }

  const iphoneCat = await prisma.category.findUniqueOrThrow({ where: { slug: "iphone" } });

  // Sample products
  const products = [
    {
      title: "iPhone 12 Pro Max 128GB",
      brand: "Apple",
      model: "iPhone 12 Pro Max",
      storage: "128GB",
      color: "Graphite",
      condition: ProductCondition.percent99,
      batteryHealth: 92,
      warranty: "Bảo hành 3 tháng",
      price: 9900000,
      comparePrice: 11500000,
      stock: 3,
      featured: true,
      shortDescription: "iPhone 12 Pro Max 99%, pin 92%, nguyên bản, không sửa chữa.",
      longDescription:
        "## iPhone 12 Pro Max 128GB Graphite\n\nMáy **99%** nguyên bản, pin **92%**, kiểm tra đầy đủ bằng 3uTools.\n\n- Bảo hành **3 tháng** phần cứng\n- Tặng kèm sạc + ốp lưng\n- Hỗ trợ thu cũ đổi mới",
    },
    {
      title: "iPhone 14 Pro Max 256GB",
      brand: "Apple",
      model: "iPhone 14 Pro Max",
      storage: "256GB",
      color: "Deep Purple",
      condition: ProductCondition.like_new,
      batteryHealth: 100,
      warranty: "Bảo hành 6 tháng",
      price: 18900000,
      comparePrice: 21000000,
      stock: 2,
      featured: true,
      shortDescription: "iPhone 14 Pro Max Like New, pin 100%, còn bảo hành Apple.",
      longDescription:
        "## iPhone 14 Pro Max 256GB Deep Purple\n\nMáy **Like New**, pin **100%**, còn bảo hành Apple chính hãng.",
    },
    {
      title: "iPhone 15 Pro Max 512GB",
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      storage: "512GB",
      color: "Natural Titanium",
      condition: ProductCondition.new_seal,
      batteryHealth: 100,
      warranty: "Bảo hành 12 tháng",
      price: 28900000,
      comparePrice: 30900000,
      stock: 1,
      featured: true,
      shortDescription: "iPhone 15 Pro Max New Seal, fullbox, chưa kích hoạt.",
      longDescription:
        "## iPhone 15 Pro Max 512GB Natural Titanium\n\nMáy **New Seal**, fullbox, chưa kích hoạt.",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: slugify(p.title) },
      update: {},
      create: {
        ...p,
        slug: slugify(p.title),
        categoryId: iphoneCat.id,
        status: ProductStatus.published,
        publishedAt: new Date(),
        tags: ["iphone", "apple", p.model!.toLowerCase()],
      },
    });
  }

  // ===================================================================
  // Repair services — Bảng giá sửa chữa Anh Táo Mobile
  // Nguồn: "Bảng giá sửa chữa.docx" + 3 ảnh bảng giá (màn hình, vỏ/lưng)
  // Giá trong data tính theo NGHÌN ĐỒNG, sẽ nhân 1000 khi ghi vào DB.
  // ===================================================================

  // Chuẩn hoá serviceGroup của các record cũ (nhãn tiếng Việt) sang slug hiển thị
  const legacyGroupMap: Record<string, string> = {
    "Thay pin": "thay-pin",
    "Thay màn hình": "thay-man-hinh",
    "Ép kính": "ep-kinh",
    "Chân sạc": "thay-chan-sac",
  };
  for (const [label, slug] of Object.entries(legacyGroupMap)) {
    await prisma.repairService.updateMany({
      where: { serviceGroup: label },
      data: { serviceGroup: slug },
    });
  }

  const K = 1000;
  type Price = number | [number, number]; // nghìn đồng, hoặc [min, max]
  const toMin = (p: Price) => (Array.isArray(p) ? p[0] : p) * K;
  const toMax = (p: Price) => (Array.isArray(p) ? p[1] : p) * K;
  const fmtVnd = (p: Price) => {
    const f = (n: number) => (n * K).toLocaleString("vi-VN") + "đ";
    return Array.isArray(p) ? `${f(p[0])} - ${f(p[1])}` : f(p);
  };

  type Row = { model: string; price: Price; quality?: string; note?: string };
  type Group = {
    slug: string;
    serviceName: string; // dùng để tạo title: `${serviceName} ${model}`
    warranty: string;
    estimatedTime: string;
    coverImage?: string;
    short: (model: string, price: Price) => string;
    rows: Row[];
  };

  const groups: Group[] = [
    {
      slug: "thay-pin",
      serviceName: "Thay pin",
      warranty: "Bảo hành 3 tháng",
      estimatedTime: "30-45 phút",
      short: (m, p) => `Thay pin ${m} dung lượng chuẩn, bảo hành 3 tháng, lấy liền. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 6", price: 260 },
        { model: "iPhone 7", price: 260 },
        { model: "iPhone 7 Plus", price: 260 },
        { model: "iPhone 8", price: 280 },
        { model: "iPhone 8 Plus", price: 290 },
        { model: "iPhone X", price: 410 },
        { model: "iPhone XS", price: 450 },
        { model: "iPhone XR", price: 450 },
        { model: "iPhone XS Max", price: 500 },
        { model: "iPhone 11", price: 500 },
        { model: "iPhone 11 Pro", price: 550 },
        { model: "iPhone 11 Pro Max", price: 590 },
        { model: "iPhone 12", price: 600, note: "Áp dụng cho cả iPhone 12 mini." },
        { model: "iPhone 12 Pro", price: 600 },
        { model: "iPhone 12 Pro Max", price: 700 },
        { model: "iPhone 13 mini", price: 650 },
        { model: "iPhone 13", price: 690 },
        { model: "iPhone 13 Pro", price: 790 },
        { model: "iPhone 13 Pro Max", price: 870 },
        { model: "iPhone 14", price: 810 },
        { model: "iPhone 14 Plus", price: 850 },
        { model: "iPhone 14 Pro", price: 920 },
        { model: "iPhone 14 Pro Max", price: 1110 },
        { model: "iPhone 15", price: 850 },
        { model: "iPhone 15 Plus", price: 930 },
        { model: "iPhone 15 Pro", price: 1080 },
        { model: "iPhone 15 Pro Max", price: 1150 },
      ],
    },
    {
      slug: "do-vo",
      serviceName: "Độ vỏ",
      warranty: "Bảo hành 3 tháng",
      estimatedTime: "60-90 phút",
      coverImage: "/repair/gia-thay-vo-lung.jpg",
      short: (m, p) => `Độ vỏ ${m} đẹp/zin, đủ màu, lên form chuẩn. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 6", price: 490 },
        { model: "iPhone 7", price: 550 },
        { model: "iPhone 7 Plus", price: 550 },
        { model: "iPhone 8", price: 600 },
        { model: "iPhone 8 Plus", price: 600 },
        { model: "iPhone X", price: 790 },
        { model: "iPhone XS", price: 680 },
        { model: "iPhone XR", price: 700 },
        { model: "iPhone XS Max", price: 880 },
        { model: "iPhone 11", price: 650 },
        { model: "iPhone 11 Pro", price: 850 },
        { model: "iPhone 11 Pro Max", price: [1050, 1200] },
        { model: "iPhone 12", price: 750 },
        { model: "iPhone 12 Pro", price: 1150 },
        { model: "iPhone 12 Pro Max", price: [1250, 1500] },
        { model: "iPhone 13 mini", price: 800 },
        { model: "iPhone 13", price: 880 },
        { model: "iPhone 13 Pro", price: 1200 },
        { model: "iPhone 13 Pro Max", price: [1300, 1550] },
        { model: "iPhone 14", price: 900 },
        { model: "iPhone 14 Plus", price: 1050 },
        { model: "iPhone 14 Pro", price: [1450, 1750] },
        { model: "iPhone 14 Pro Max", price: [1550, 1850] },
        { model: "iPhone 15 Plus", price: 1050 },
      ],
    },
    {
      slug: "thay-kinh-lung",
      serviceName: "Thay kính lưng",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "60-90 phút",
      coverImage: "/repair/gia-thay-vo-lung.jpg",
      short: (m, p) => `Thay kính lưng ${m}, khớp màu, kín nước. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 6", price: 330 },
        { model: "iPhone 7", price: 350 },
        { model: "iPhone 7 Plus", price: 350 },
        { model: "iPhone 8", price: 400 },
        { model: "iPhone 8 Plus", price: 400 },
        { model: "iPhone X", price: 420 },
        { model: "iPhone XS", price: 420 },
        { model: "iPhone XR", price: 420 },
        { model: "iPhone XS Max", price: 460 },
        { model: "iPhone 11", price: 460 },
        { model: "iPhone 11 Pro", price: 520 },
        { model: "iPhone 11 Pro Max", price: 600 },
        { model: "iPhone 12", price: 460 },
        { model: "iPhone 12 Pro", price: 600 },
        { model: "iPhone 12 Pro Max", price: 650 },
        { model: "iPhone 13", price: 550 },
        { model: "iPhone 13 Pro", price: 720 },
        { model: "iPhone 13 Pro Max", price: 800 },
        { model: "iPhone 14", price: 600 },
        { model: "iPhone 14 Plus", price: 700 },
        { model: "iPhone 14 Pro", price: 800 },
        { model: "iPhone 14 Pro Max", price: 880 },
        { model: "iPhone 15", price: 790 },
        { model: "iPhone 15 Plus", price: 700 },
        { model: "iPhone 15 Pro Max", price: [950, 1950], quality: "Thường / Zin", note: "Kính lưng thường 950k, zin 1.950k." },
        { model: "iPhone 16 Pro", price: [950, 2300], quality: "Thường / Zin", note: "Kính lưng thường 950k, zin 2.300k." },
        { model: "iPhone 16 Pro Max", price: [1000, 2500], quality: "Thường / Zin", note: "Kính lưng thường 1.000k, zin 2.500k." },
      ],
    },
    {
      slug: "ep-kinh",
      serviceName: "Ép kính",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "60-90 phút",
      short: (m, p) => `Ép kính ${m} (thay mặt kính, giữ nguyên màn zin). Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 6", price: 250 },
        { model: "iPhone 7", price: 300 },
        { model: "iPhone 7 Plus", price: 300 },
        { model: "iPhone 8", price: 350 },
        { model: "iPhone 8 Plus", price: 350 },
        { model: "iPhone X", price: 380 },
        { model: "iPhone XS", price: 380 },
        { model: "iPhone XR", price: 380 },
        { model: "iPhone XS Max", price: 500 },
        { model: "iPhone 11", price: 500 },
        { model: "iPhone 11 Pro", price: 550 },
        { model: "iPhone 11 Pro Max", price: 580 },
        { model: "iPhone 12", price: 580 },
        { model: "iPhone 12 Pro", price: 580 },
        { model: "iPhone 12 Pro Max", price: 650 },
        { model: "iPhone 13", price: 650 },
        { model: "iPhone 13 Pro", price: 650 },
        { model: "iPhone 13 Pro Max", price: 750 },
        { model: "iPhone 14", price: 700 },
        { model: "iPhone 14 Plus", price: 800 },
        { model: "iPhone 14 Pro", price: 880 },
        { model: "iPhone 14 Pro Max", price: 900 },
        { model: "iPhone 15", price: 900 },
        { model: "iPhone 15 Plus", price: 950 },
        { model: "iPhone 15 Pro", price: 1000 },
        { model: "iPhone 15 Pro Max", price: 1000 },
        { model: "iPhone 16", price: 890 },
        { model: "iPhone 16 Plus", price: 1100 },
        { model: "iPhone 16 Pro", price: 1100 },
        { model: "iPhone 16 Pro Max", price: 1100 },
      ],
    },
    {
      slug: "thay-chan-sac",
      serviceName: "Thay chân sạc",
      warranty: "Bảo hành 3 tháng",
      estimatedTime: "45-60 phút",
      short: (m, p) => `Thay chân sạc ${m}, sạc ổn định, nhận mic chuẩn. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 7 Plus", price: 400 },
        { model: "iPhone 8", price: 400 },
        { model: "iPhone 8 Plus", price: 400 },
        { model: "iPhone X", price: 400 },
        { model: "iPhone XS", price: 420 },
        { model: "iPhone XR", price: 420 },
        { model: "iPhone XS Max", price: 500 },
        { model: "iPhone 11", price: 550 },
        { model: "iPhone 11 Pro Max", price: 980, quality: "Zin" },
        { model: "iPhone 12 Pro Max", price: [750, 900], quality: "Thường / Zin", note: "Chân sạc thường 750k, zin 900k." },
        { model: "iPhone 15 Pro Max", price: 1350, quality: "Zin" },
      ],
    },
    {
      slug: "ep-cam-ung",
      serviceName: "Ép cảm ứng",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "60-90 phút",
      short: (m, p) => `Ép cảm ứng ${m}, khôi phục cảm ứng mượt mà. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone X", price: 690 },
        { model: "iPhone XS", price: 690 },
        { model: "iPhone XS Max", price: 700 },
        { model: "iPhone 11", price: 690 },
        { model: "iPhone 11 Pro", price: 800 },
        { model: "iPhone 11 Pro Max", price: 850 },
        { model: "iPhone 12", price: 850 },
        { model: "iPhone 12 Pro", price: 820 },
        { model: "iPhone 12 Pro Max", price: [1250, 1500] },
        { model: "iPhone 13", price: [1500, 1750] },
        { model: "iPhone 13 Pro", price: [1500, 1750] },
        { model: "iPhone 13 Pro Max", price: [1500, 1750] },
      ],
    },
    {
      slug: "thay-camera-sau",
      serviceName: "Thay camera sau",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "45-60 phút",
      short: (m, p) => `Thay camera sau ${m}, chụp nét, lấy nét nhanh. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 7 Plus", price: [700, 900] },
        { model: "iPhone 12 Pro Max", price: 1800, quality: "Zin" },
        { model: "iPhone 15", price: 1550 },
      ],
    },
    {
      slug: "thay-loa-ngoai",
      serviceName: "Thay loa ngoài",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "30-45 phút",
      short: (m, p) => `Thay loa ngoài ${m}, âm to rõ, không rè. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 11", price: [290, 490], quality: "Thường / Zin", note: "Loa thường 290k, zin 490k." },
        { model: "iPhone 12 Pro Max", price: [450, 650], quality: "Thường / Zin", note: "Loa thường 450k, zin 650k." },
      ],
    },
    {
      slug: "thay-loa-trong",
      serviceName: "Thay loa trong",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "30-45 phút",
      short: (m, p) => `Thay loa trong (loa thoại) ${m}, nghe gọi rõ. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 13 Pro Max", price: [350, 600], quality: "Thường / Zin", note: "Loa trong thường 350k, zin 600k." },
      ],
    },
    {
      slug: "thay-kinh-camera",
      serviceName: "Thay kính camera",
      warranty: "Bảo hành 1 tháng",
      estimatedTime: "20-30 phút",
      short: (m, p) => `Thay kính camera ${m}, trong suốt, không ảnh hưởng chất lượng ảnh. Giá ${fmtVnd(p)}.`,
      rows: [
        { model: "iPhone 6", price: 130 },
        { model: "iPhone 11", price: [100, 250], note: "100k/mắt; thay 3 mắt 250k." },
        { model: "iPhone 14", price: [130, 350], note: "130k/mắt; thay 3 mắt 350k." },
      ],
    },
  ];

  // Màn hình — tổng hợp nhiều loại màn (Anh Táo + Salaman) cho mỗi dòng máy
  type ScreenOpt = { label: string; price: Price };
  const screenOptions: Record<string, ScreenOpt[]> = {
    "iPhone X": [
      { label: "Màn LK OLED", price: 1100 },
      { label: "Màn Zin bóc máy", price: 2150 },
      { label: "Màn LCD (Salaman)", price: 780 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1350 },
    ],
    "iPhone XS": [
      { label: "Màn LK OLED", price: 1100 },
      { label: "Màn Zin bóc máy", price: 1850 },
      { label: "Màn LCD (Salaman)", price: 780 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1350 },
    ],
    "iPhone XR": [
      { label: "Màn LCD", price: 750 },
      { label: "Màn Zin bóc máy", price: 1300 },
      { label: "Màn LCD (Salaman)", price: 780 },
    ],
    "iPhone XS Max": [
      { label: "Màn LK OLED", price: 1300 },
      { label: "Màn Zin bóc máy", price: 2850 },
      { label: "Màn LCD (Salaman)", price: 880 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1450 },
    ],
    "iPhone 11": [
      { label: "Màn LCD", price: 780 },
      { label: "Màn Zin bóc máy", price: 1400 },
      { label: "Màn LCD (Salaman)", price: 800 },
    ],
    "iPhone 11 Pro": [
      { label: "Màn LK OLED", price: 1200 },
      { label: "Màn Zin bóc máy", price: 2150 },
      { label: "Màn LCD (Salaman)", price: 880 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1450 },
    ],
    "iPhone 11 Pro Max": [
      { label: "Màn LK OLED", price: 1400 },
      { label: "Màn Zin bóc máy", price: 2850 },
      { label: "Màn LCD (Salaman)", price: 920 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1550 },
    ],
    "iPhone 12": [
      { label: "Màn LK OLED", price: 1500 },
      { label: "Màn Zin bóc máy", price: 2000 },
      { label: "Màn LCD (Salaman)", price: 850 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1690 },
    ],
    "iPhone 12 Pro": [
      { label: "Màn LK OLED", price: 1500 },
      { label: "Màn Zin bóc máy", price: 2750 },
      { label: "Màn LCD (Salaman)", price: 950 },
      { label: "Màn OLED/120Hz (Salaman)", price: 1800 },
    ],
    "iPhone 12 Pro Max": [
      { label: "Màn LK OLED", price: 2050 },
      { label: "Màn Zin bóc máy", price: 4350 },
      { label: "Màn LCD (Salaman)", price: 1200 },
      { label: "Màn OLED/120Hz (Salaman)", price: 2050 },
    ],
    "iPhone 13": [
      { label: "Màn LK OLED", price: 2300 },
      { label: "Màn Zin bóc máy", price: 3350 },
      { label: "Màn LCD (Salaman)", price: 1050 },
      { label: "Màn OLED/120Hz (Salaman)", price: 2200 },
    ],
    "iPhone 13 Pro": [
      { label: "Màn LCD", price: 1260 },
      { label: "Màn Zin bóc máy", price: 5700 },
      { label: "Màn LCD (Salaman)", price: 1100 },
      { label: "Màn OLED/120Hz (Salaman)", price: 5700 },
    ],
    "iPhone 13 Pro Max": [
      { label: "Màn LK OLED", price: 3000 },
      { label: "Màn Zin bóc máy", price: 6100 },
      { label: "Màn LCD (Salaman)", price: 1350 },
      { label: "Màn OLED/120Hz (Salaman)", price: 3690 },
    ],
    "iPhone 14": [
      { label: "Màn LK OLED", price: 2400 },
      { label: "Màn Zin bóc máy", price: 4850 },
      { label: "Màn LCD (Salaman)", price: 1050 },
      { label: "Màn OLED/120Hz (Salaman)", price: 2300 },
    ],
    "iPhone 14 Plus": [
      { label: "Màn LK OLED", price: 3400 },
      { label: "Màn Zin bóc máy", price: 4700 },
      { label: "Màn LCD (Salaman)", price: 1150 },
      { label: "Màn OLED/120Hz (Salaman)", price: 2690 },
    ],
    "iPhone 14 Pro": [
      { label: "Màn LK OLED", price: 3250 },
      { label: "Màn Zin bóc máy", price: 7450 },
      { label: "Màn LCD (Salaman)", price: 1200 },
    ],
    "iPhone 14 Pro Max": [
      { label: "Màn LK OLED", price: 4150 },
      { label: "Màn Zin bóc máy", price: 8500 },
      { label: "Màn LCD (Salaman)", price: 1700 },
      { label: "Màn OLED/120Hz (Salaman)", price: 4500 },
    ],
    "iPhone 15": [
      { label: "Màn LCD", price: 1550 },
      { label: "Màn Zin bóc máy", price: 5500 },
      { label: "Màn LCD (Salaman)", price: 1150 },
      { label: "Màn OLED/120Hz (Salaman)", price: 3850 },
    ],
    "iPhone 15 Plus": [
      { label: "Màn LCD", price: 1550 },
      { label: "Màn Zin bóc máy", price: 5700 },
      { label: "Màn LCD (Salaman)", price: 1200 },
      { label: "Màn OLED/120Hz (Salaman)", price: 5000 },
    ],
    "iPhone 15 Pro": [
      { label: "Màn LK OLED", price: 4700 },
      { label: "Màn Zin bóc máy", price: 7800 },
      { label: "Màn LCD (Salaman)", price: 1500 },
      { label: "Màn OLED/120Hz (Salaman)", price: 4650 },
    ],
    "iPhone 15 Pro Max": [
      { label: "Màn LK OLED", price: 5450 },
      { label: "Màn Zin bóc máy", price: 9000 },
      { label: "Màn LCD (Salaman)", price: 1900 },
      { label: "Màn OLED/120Hz (Salaman)", price: 6700 },
    ],
    "iPhone 16E": [
      { label: "Màn LK OLED", price: 2600 },
      { label: "Màn Zin bóc máy", price: 6500 },
    ],
    "iPhone 16": [
      { label: "Màn LK OLED", price: 4000 },
      { label: "Màn Zin bóc máy", price: 6900 },
      { label: "Màn LCD (Salaman)", price: 2600 },
    ],
    "iPhone 16 Plus": [
      { label: "Màn LCD", price: 2800 },
      { label: "Màn Zin bóc máy", price: 7200 },
      { label: "Màn LCD (Salaman)", price: 2800 },
    ],
    "iPhone 16 Pro": [
      { label: "Màn LCD", price: 4900 },
    ],
    "iPhone 16 Pro Max": [
      { label: "Màn LCD", price: 5900 },
      { label: "Màn Zin bóc máy", price: 9700 },
    ],
  };

  type RepairRecord = {
    title: string;
    deviceBrand: string;
    deviceModel: string;
    serviceGroup: string;
    serviceName: string;
    partType: string | null;
    partQuality: string | null;
    priceMin: number;
    priceMax: number;
    warranty: string;
    estimatedTime: string;
    shortDescription: string;
    longDescription: string | null;
    coverImage: string | null;
    featured: boolean;
  };

  const repairRecords: RepairRecord[] = [];

  // Ghép note + ảnh bảng giá vào longDescription vì trang chi tiết chỉ render
  // longDescription (markdown), không render coverImage riêng.
  const buildLong = (opts: { title: string; note?: string | null; image?: string | null; header?: string }) => {
    const parts: string[] = [];
    if (opts.header) parts.push(opts.header);
    if (opts.note) parts.push(opts.note);
    if (opts.image) parts.push(`![${opts.title}](${opts.image})`);
    parts.push(
      "_Giá tham khảo, có thể thay đổi theo tình trạng thực tế của máy. Liên hệ 08.1900.0011 để được tư vấn._"
    );
    return parts.join("\n\n");
  };

  for (const g of groups) {
    for (const r of g.rows) {
      const title = `${g.serviceName} ${r.model}`;
      repairRecords.push({
        title,
        deviceBrand: "Apple",
        deviceModel: r.model,
        serviceGroup: g.slug,
        serviceName: g.serviceName,
        partType: r.quality ?? null,
        partQuality: r.quality ?? null,
        priceMin: toMin(r.price),
        priceMax: toMax(r.price),
        warranty: g.warranty,
        estimatedTime: g.estimatedTime,
        shortDescription: g.short(r.model, r.price),
        longDescription: buildLong({ title, note: r.note, image: g.coverImage }),
        coverImage: g.coverImage ?? null,
        featured: false,
      });
    }
  }

  for (const [model, opts] of Object.entries(screenOptions)) {
    const min = Math.min(...opts.map((o) => toMin(o.price)));
    const max = Math.max(...opts.map((o) => toMax(o.price)));
    const lines = opts.map((o) => `- **${o.label}:** ${fmtVnd(o.price)}`).join("\n");
    const title = `Thay màn hình ${model}`;
    repairRecords.push({
      title,
      deviceBrand: "Apple",
      deviceModel: model,
      serviceGroup: "thay-man-hinh",
      serviceName: "Thay màn hình",
      partType: "LCD / OLED / Zin bóc máy",
      partQuality: "Nhiều loại: LCD / OLED / Zin",
      priceMin: min,
      priceMax: max,
      warranty: "Bảo hành 3 tháng",
      estimatedTime: "30-60 phút",
      shortDescription: `Thay màn hình ${model} - nhiều lựa chọn LCD/OLED/Zin bóc máy. Giá từ ${min.toLocaleString("vi-VN")}đ.`,
      longDescription: buildLong({
        title,
        header: `## Bảng giá thay màn hình ${model}\n\n${lines}`,
        image: "/repair/gia-thay-man-hinh-anh-tao.jpg",
      }),
      coverImage: "/repair/gia-thay-man-hinh-anh-tao.jpg",
      featured: model.includes("Pro Max"),
    });
  }

  for (const s of repairRecords) {
    const slug = slugify(s.title);
    const data = {
      title: s.title,
      deviceBrand: s.deviceBrand,
      deviceModel: s.deviceModel,
      serviceGroup: s.serviceGroup,
      serviceName: s.serviceName,
      partType: s.partType,
      partQuality: s.partQuality,
      priceMin: s.priceMin,
      priceMax: s.priceMax,
      warranty: s.warranty,
      estimatedTime: s.estimatedTime,
      shortDescription: s.shortDescription,
      longDescription: s.longDescription,
      coverImage: s.coverImage,
      featured: s.featured,
      status: ProductStatus.published,
      tags: ["sua-chua", s.serviceGroup],
    };
    await prisma.repairService.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug, publishedAt: new Date() },
    });
  }

  console.log(`Seeded ${repairRecords.length} repair services.`);

  // SEO pages
  const seoPages = [
    {
      slug: "iphone-cu-binh-duong",
      title: "iPhone cũ Bình Dương — Anh Táo Mobile",
      h1: "iPhone cũ Bình Dương giá tốt, bảo hành rõ ràng",
      metaDescription:
        "Mua iPhone cũ tại Bình Dương — máy đẹp, kiểm tra kỹ, bảo hành rõ ràng. iPhone 12, 13, 14, 15 Pro Max cũ tại Anh Táo Mobile.",
    },
    {
      slug: "thay-pin-iphone-binh-duong",
      title: "Thay pin iPhone Bình Dương lấy liền — Anh Táo Mobile",
      h1: "Thay pin iPhone Bình Dương — lấy liền, bảo hành 3 tháng",
      metaDescription:
        "Thay pin iPhone tại Bình Dương, lấy liền 45 phút, pin chính hãng, bảo hành 3 tháng.",
    },
    {
      slug: "cach-mua-iphone-cu-khong-bi-loi",
      title: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
      h1: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
      body: `<!-- ========== SCHEMA JSON-LD ========== -->
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
      "author": {
        "@type": "Person",
        "name": "Anh Táo",
        "url": "https://anhtaomobile.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Anh Táo Mobile",
        "url": "https://anhtaomobile.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://anhtaomobile.com/wp-content/uploads/2026/07/logo-anh-tao.png"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1013 Cách Mạng Tháng 8",
          "addressLocality": "Thủ Dầu Một",
          "addressRegion": "Bình Dương",
          "addressCountry": "VN"
        },
        "telephone": "0819000011"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Mua iPhone cũ nên kiểm tra gì đầu tiên?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Điều đầu tiên cần kiểm tra là ngoại hình máy (khung, màn hình, ốc vít) và màn hình xem có bị thay chưa. Sau đó kiểm tra Face ID/Touch ID, pin, camera, loa, mic. Cuối cùng kiểm tra IMEI để xác nhận máy không bị khóa iCloud, không phải máy lock."
          }
        },
        {
          "@type": "Question",
          "name": "iPhone cũ bao nhiêu phần trăm pin là tốt?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pin iPhone cũ từ 85% trở lên được coi là tốt, dùng được 1-2 năm trước khi cần thay. Pin dưới 80% là yếu, nên thay pin mới ngay. Chi phí thay pin iPhone tại Anh Táo Mobile từ 350.000đ đến 700.000đ tùy dòng máy, lấy liền 45 phút."
          }
        },
        {
          "@type": "Question",
          "name": "Làm sao biết iPhone cũ có bị thay màn hình chưa?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Có 3 cách kiểm tra: (1) So màu viền màn hình trong tối — màn zin viền đen tuyền, màn thay thường hơi xám; (2) Tắt hẳn màn hình, soi dưới ánh sáng mạnh — màn zin phản chiếu đều, không gợn; (3) Vào Cài đặt > Cài đặt chung > Giới thiệu — nếu có thông báo 'Không xác định được linh kiện chính hãng' là máy đã thay."
          }
        },
        {
          "@type": "Question",
          "name": "Mua iPhone cũ ở đâu uy tín tại Bình Dương?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Anh Táo Mobile tại 1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương là địa chỉ chuyên iPhone cũ uy tín. Cam kết máy đẹp, kiểm tra kỹ, bảo hành main 12 tháng 1 đổi 1, pin 60 tháng. Có hỗ trợ thu cũ đổi mới và trả góp 0%."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://anhtaomobile.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://anhtaomobile.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "Kinh Nghiệm Mua iPhone Cũ Không Bị Lỗi", "item": "https://anhtaomobile.com/blog/kinh-nghiem-mua-iphone-cu-khong-bi-loi" }
      ]
    }
  ]
}
</script>
<article class="blog-post-content">

  <!-- Mở bài: trả lời thẳng câu hỏi người dùng -->
  <p><strong>Mua iPhone cũ là cách tiết kiệm 30-50% so với mua mới, nhưng nếu không biết kiểm tra, bạn dễ "tiền mất tật mang" với máy lỗi, máy thay linh kiện dỏm, thậm chí máy mất trộm bị khóa iCloud.</strong></p>

  <p>Với hơn 5 năm kinh nghiệm trong nghề mua bán — sửa chữa iPhone, Anh Táo Mobile tổng hợp cho bạn <strong>checklist 10 bước kiểm tra iPhone cũ từ A-Z</strong>. Dù bạn mua ở đâu, làm theo checklist này sẽ giúp bạn tránh 90% rủi ro thường gặp.</p>

  <div class="toc">
    <h2>Nội dung chính</h2>
    <ol>
      <li><a href="#buoc-1">Bước 1: Kiểm tra ngoại hình — khung, màn hình, ốc vít</a></li>
      <li><a href="#buoc-2">Bước 2: Kiểm tra màn hình — zin hay đã thay?</a></li>
      <li><a href="#buoc-3">Bước 3: Kiểm tra Face ID / Touch ID</a></li>
      <li><a href="#buoc-4">Bước 4: Kiểm tra pin iPhone cũ</a></li>
      <li><a href="#buoc-5">Bước 5: Kiểm tra IMEI và tình trạng khóa</a></li>
      <li><a href="#buoc-6">Bước 6: Kiểm tra camera trước & sau</a></li>
      <li><a href="#buoc-7">Bước 7: Kiểm tra loa, mic, rung</a></li>
      <li><a href="#buoc-8">Bước 8: Kiểm tra cảm biến & cổng sạc</a></li>
      <li><a href="#buoc-9">Bước 9: Kiểm tra mainboard — bài test nặng</a></li>
      <li><a href="#buoc-10">Bước 10: Kiểm tra phụ kiện đi kèm & giấy tờ</a></li>
    </ol>
  </div>

  <!-- BƯỚC 1 -->
  <h2 id="buoc-1">Bước 1: Kiểm tra ngoại hình — khung, màn hình, ốc vít</h2>

  <p>Ngoại hình là thứ dễ kiểm tra nhất nhưng cũng dễ bị bỏ qua nhất vì tâm lý "máy cũ thì phải trầy".</p>

  <h3>Những điểm cần kiểm tra:</h3>
  <ul>
    <li><strong>Khung viền:</strong> Xem có móp, cong không. Máy cong nhẹ có thể làm hở màn hình, vào nước sau này. Đặt máy lên mặt phẳng kính để test độ cong.</li>
    <li><strong>Ốc vít dưới chân sạc:</strong> Ốc còn nguyên, không trầy xước, không bị "đóng lại" là dấu hiệu máy chưa từng mở ra.</li>
    <li><strong>Mặt lưng kính:</strong> Nứt nhỏ cũng làm mất khả năng chống nước. Nếu nứt, nên <a href="https://anhtaomobile.com/sua-chua/">ép lưng ngay</a> (chi phí từ 350.000đ).</li>
    <li><strong>Nút bấm:</strong> Nút nguồn, nút âm lượng, nút gạt rung — tất cả phải bấm nảy, không bị lún, không bị kẹt.</li>
  </ul>

  <p>💡 <strong>Mẹo nhỏ:</strong> Dùng đèn pin soi vào khe giữa màn hình và khung. Nếu thấy keo chảy, dấu hiệu máy đã từng thay màn hình hoặc ép kính.</p>

  <!-- BƯỚC 2 -->
  <h2 id="buoc-2">Bước 2: Kiểm tra màn hình — zin hay đã thay?</h2>

  <p>Đây là bước quan trọng nhất. Màn hình là linh kiện đắt nhất trên iPhone (chiếm 30-40% giá máy). Một màn hình thay thế kém chất lượng sẽ gây ra: màu sai, cảm ứng kém, hao pin nhanh, và quan trọng nhất — <strong>mất True Tone</strong>.</p>

  <h3>3 cách kiểm tra màn hình iPhone cũ:</h3>

  <table>
    <thead>
      <tr>
        <th>Cách kiểm tra</th>
        <th>Màn hình Zin</th>
        <th>Màn hình đã thay</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>So màu viền đen</strong> — tắt màn hình, nhìn trong bóng tối</td>
        <td>Viền đen tuyền, hòa vào khung</td>
        <td>Viền hơi xám, ánh xanh, không đều màu</td>
      </tr>
      <tr>
        <td><strong>Soi dưới ánh sáng mạnh</strong> — tắt màn hình, soi đèn</td>
        <td>Phản chiếu đều, không gợn sóng</td>
        <td>Gợn sóng, vân lạ, không đồng nhất</td>
      </tr>
      <tr>
        <td><strong>Kiểm tra thông báo linh kiện</strong> — Cài đặt → Cài đặt chung → Giới thiệu</td>
        <td>Không có cảnh báo gì</td>
        <td>Hiện "Không xác định được linh kiện chính hãng"</td>
      </tr>
    </tbody>
  </table>

  <p>⚠️ <strong>Lưu ý quan trọng:</strong> Từ iPhone 12 trở lên, Apple ép buộc ghép cặp (pairing) linh kiện. Nếu màn hình bị thay mà không được ghép cặp, máy sẽ hiện cảnh báo trong Cài đặt. Tuy nhiên, thợ lành nghề có thể chuyển IC màn zin sang màn mới để "qua mặt" — chỉ có thợ chuyên nghiệp mới phát hiện được.</p>

  <p>👉 Nếu bạn ở <strong>Bình Dương (Thủ Dầu Một, Thuận An, Dĩ An)</strong>, mang máy đến Anh Táo Mobile để được kiểm tra màn hình miễn phí bằng kính hiển vi chuyên dụng.</p>

  <!-- BƯỚC 3 -->
  <h2 id="buoc-3">Bước 3: Kiểm tra Face ID / Touch ID</h2>

  <p>Face ID và Touch ID cực kỳ quan trọng — nếu hỏng thì <strong>gần như không sửa được</strong>. Đây là linh kiện được mã hóa và ghép cặp với mainboard. Một khi hỏng, bạn chỉ còn cách dùng mật mã (passcode) để mở máy, rất bất tiện.</p>

  <h3>Cách kiểm tra:</h3>
  <ol>
    <li>Vào Cài đặt → Face ID & Mật mã (hoặc Touch ID & Mật mã)</li>
    <li>Thiết lập khuôn mặt hoặc vân tay mới</li>
    <li>Khóa máy và mở bằng Face ID / Touch ID — phải hoạt động nhanh, mượt</li>
  </ol>

  <p>⚠️ Nếu máy báo "Không thể kích hoạt Face ID trên iPhone này", tuyệt đối <strong>không mua</strong>.</p>

  <!-- BƯỚC 4 -->
  <h2 id="buoc-4">Bước 4: Kiểm tra pin iPhone cũ</h2>

  <p>Pin là linh kiện hao mòn tự nhiên và là yếu tố quyết định trải nghiệm hàng ngày. Pin yếu đồng nghĩa với sạc liên tục, tụt nhanh, và có thể sập nguồn đột ngột.</p>

  <h3>Cách kiểm tra pin iPhone:</h3>

  <ul>
    <li><strong>Vào Cài đặt → Pin → Tình trạng pin & Sạc:</strong> Xem % dung lượng tối đa</li>
    <li><strong>Trên 85%:</strong> Pin còn tốt, dùng 1-2 năm trước khi cần thay</li>
    <li><strong>80-85%:</strong> Pin trung bình, nên cân nhắc thay trong 6 tháng tới</li>
    <li><strong>Dưới 80%:</strong> Pin yếu, hiện cảnh báo "Dịch vụ", nên thay ngay</li>
  </ul>

  <p>💡 <strong>Mẹo:</strong> Vào Cài đặt → Ẩn danh & Quyền riêng tư → Phân tích & Cải tiến → Dữ liệu Phân tích. Tìm file "log-aggregated", mở bằng Notes và tìm "battery" — bạn sẽ thấy số chu kỳ sạc thực tế của máy. Đây là số liệu không thể chỉnh sửa được.</p>

  <p>🔋 <strong>Bảng giá thay pin tham khảo tại Anh Táo Mobile:</strong></p>
  <table>
    <thead>
      <tr>
        <th>Dòng máy</th>
        <th>Loại pin</th>
        <th>Giá</th>
        <th>Thời gian</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>iPhone 8 Plus / X</td><td>Pin Pisen</td><td>350.000đ</td><td>30-45 phút</td></tr>
      <tr><td>iPhone XS Max / 11 Series</td><td>Pin Pisen</td><td>450.000đ</td><td>45 phút</td></tr>
      <tr><td>iPhone 12 Series</td><td>Pin Pisen</td><td>550.000đ</td><td>45-60 phút</td></tr>
      <tr><td>iPhone 13 Series</td><td>Pin Pisen</td><td>600.000đ</td><td>45-60 phút</td></tr>
      <tr><td>iPhone 14 Series</td><td>Pin Pisen</td><td>700.000đ</td><td>45-60 phút</td></tr>
      <tr><td>iPhone 15 Series</td><td>Pin OEM</td><td>800.000đ</td><td>60 phút</td></tr>
    </tbody>
  </table>

  <!-- BƯỚC 5 -->
  <h2 id="buoc-5">Bước 5: Kiểm tra IMEI và tình trạng khóa</h2>

  <p>Đây là bước bắt buộc. Mua phải máy khóa iCloud (máy mất trộm, quên mật khẩu) là mất trắng tiền. Máy lock network (khóa nhà mạng nước ngoài) thì không dùng được SIM Việt Nam nếu không có SIM ghép.</p>

  <h3>Cách kiểm tra:</h3>
  <ol>
    <li>Vào Cài đặt → Cài đặt chung → Giới thiệu → kéo xuống xem <strong>IMEI</strong></li>
    <li>So sánh IMEI trên máy với IMEI trên khay SIM</li>
    <li>Kiểm tra tại <a href="https://imei.info" target="_blank" rel="nofollow noopener">imei.info</a> hoặc <strong>iphoneimei.net</strong> để xác nhận:
      <ul>
        <li>Find My iPhone: OFF (quan trọng nhất)</li>
        <li>SIM Lock: Unlocked</li>
        <li>Blacklist: Clean</li>
      </ul>
    </li>
    <li>Vào Cài đặt → iCloud: đảm bảo không có tài khoản lạ đang đăng nhập</li>
  </ol>

  <p>🚫 <strong>Tuyệt đối không mua nếu:</strong> máy còn tài khoản iCloud, Find My iPhone đang ON, hoặc IMEI trên máy không khớp với khay SIM.</p>

  <!-- BƯỚC 6 -->
  <h2 id="buoc-6">Bước 6: Kiểm tra camera trước & sau</h2>

  <p>Camera iPhone rất đắt — riêng cụm camera sau của 14 Pro Max giá thay thế lên đến 2-3 triệu. Kiểm tra kỹ camera giúp bạn tránh chi phí sửa chữa lớn sau này.</p>

  <h3>Checklist kiểm tra camera:</h3>
  <ul>
    <li><strong>Camera sau:</strong> Chụp ảnh ở tất cả các chế độ: 0.5x (ultra wide), 1x (wide), 2x/3x/5x (tele). Ảnh phải nét, không bị rung, không có đốm đen</li>
    <li><strong>Camera trước:</strong> Chụp selfie, kiểm tra chân dung (Portrait) — không bị mờ, không sọc</li>
    <li><strong>Quay video:</strong> Quay 4K 60fps trong 1 phút, bật đèn flash. Xem lại — không bị giật, không bị out nét</li>
    <li><strong>Chống rung quang học (OIS):</strong> Lắc nhẹ máy khi đang quay video — ống kính phải tự động ổn định, không phát ra tiếng lạch cạch</li>
  </ul>

  <!-- BƯỚC 7 -->
  <h2 id="buoc-7">Bước 7: Kiểm tra loa, micro, rung</h2>

  <p>Nghe gọi là chức năng cơ bản nhất của điện thoại. Loa hỏng thì không nghe được, micro hỏng thì người bên kia không nghe thấy bạn.</p>

  <h3>Cách test:</h3>
  <ul>
    <li><strong>Loa ngoài:</strong> Mở YouTube, phát video bất kỳ, chỉnh volume max — không rè, không mất tiếng một bên</li>
    <li><strong>Loa trong (loa nghe):</strong> Gọi cho một số bất kỳ, áp tai nghe — tiếng rõ, không lạo xạo</li>
    <li><strong>Micro chính (dưới):</strong> Ghi âm (Voice Memos), nói rồi nghe lại — giọng rõ, không bị nghẹt</li>
    <li><strong>Micro trên (chống ồn):</strong> Gọi điện thoại, bật loa ngoài — người nghe vẫn nghe rõ</li>
    <li><strong>Rung (Taptic Engine):</strong> Gạt nút rung vài lần, vào Cài đặt → Âm thanh & Cảm ứng → bật/tắt rung</li>
  </ul>

  <!-- BƯỚC 8 -->
  <h2 id="buoc-8">Bước 8: Kiểm tra cảm biến & cổng sạc</h2>

  <h3>Danh sách cảm biến cần test:</h3>
  <ul>
    <li><strong>Cảm biến tiệm cận:</strong> Gọi điện, lấy tay che phần trên màn hình — màn hình phải tắt</li>
    <li><strong>Cảm biến ánh sáng:</strong> Bật Auto-Brightness (Cài đặt → Trợ năng → Màn hình & Cỡ chữ). Che cảm biến — màn hình phải tối đi</li>
    <li><strong>Con quay & Gia tốc kế:</strong> Mở ứng dụng Compass (La bàn) — kim la bàn phải xoay khi bạn xoay máy</li>
    <li><strong>Wifi & Bluetooth:</strong> Kết nối Wifi, bắt tay Bluetooth với thiết bị khác — hoạt động ổn định, không tự ngắt</li>
    <li><strong>Cổng sạc:</strong> Cắm sạc, lắc nhẹ dây — không bị lỏng, không báo "Sạc không được hỗ trợ"</li>
  </ul>

  <!-- BƯỚC 9 -->
  <h2 id="buoc-9">Bước 9: Kiểm tra mainboard — bài test nặng</h2>

  <p>Mainboard là "trái tim" của iPhone. Main lỗi thường có triệu chứng: tự khởi động lại, treo táo, sập nguồn khi pin còn 20-30%.</p>

  <h3>Bài test mainboard trong 15 phút:</h3>
  <ol>
    <li><strong>Test nặng:</strong> Mở cùng lúc 5-6 ứng dụng, mở Camera quay 4K 60fps trong 5 phút — máy không được nóng bất thường hoặc tự khởi động lại</li>
    <li><strong>Test pin ảo:</strong> Dùng máy đến khi pin còn 5-10% — máy không được sập nguồn đột ngột</li>
    <li><strong>Kiểm tra lịch sử khởi động lại:</strong> Vào Cài đặt → Quyền riêng tư → Phân tích → Dữ liệu phân tích. Tìm file "panic-full" hoặc "ResetCounter" — nếu có, máy từng bị treo hoặc kernel panic</li>
    <li><strong>Test sạc:</strong> Sạc máy trong lúc dùng — không báo "Nhiệt độ cao", không ngắt sạc giữa chừng</li>
  </ol>

  <!-- BƯỚC 10 -->
  <h2 id="buoc-10">Bước 10: Kiểm tra phụ kiện đi kèm & giấy tờ</h2>

  <h3>Phụ kiện nên có khi mua iPhone cũ:</h3>
  <ul>
    <li><strong>Hộp:</strong> Nếu có hộp zin, kiểm tra IMEI trên hộp khớp với máy</li>
    <li><strong>Sạc & cáp:</strong> Nên là phụ kiện chính hãng hoặc thương hiệu uy tín (Anker, Baseus, Ugreen)</li>
    <li><strong>Hóa đơn mua hàng:</strong> Cửa hàng uy tín luôn xuất hóa đơn rõ ràng</li>
  </ul>

  <!-- SO SÁNH: MUA Ở TIỆM VS ONLINE -->
  <h2>Mua iPhone cũ ở đâu: Tiệm hay Online?</h2>

  <table>
    <thead>
      <tr>
        <th>Tiêu chí</th>
        <th>Mua tại cửa hàng</th>
        <th>Mua online (chợ tốt, Facebook)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Được kiểm tra máy trực tiếp</td>
        <td>✅ Có</td>
        <td>❌ Không, chỉ xem ảnh</td>
      </tr>
      <tr>
        <td>Bảo hành</td>
        <td>✅ Rõ ràng, có tem, có hóa đơn</td>
        <td>⚠️ Thường chỉ bảo hành 1 tuần hoặc không có</td>
      </tr>
      <tr>
        <td>Giá</td>
        <td>Cao hơn 5-10% (bù lại được test + BH)</td>
        <td>Rẻ hơn nhưng rủi ro cao</td>
      </tr>
      <tr>
        <td>Rủi ro máy lock, mất trộm</td>
        <td>✅ Rất thấp</td>
        <td>❌ Cao</td>
      </tr>
      <tr>
        <td>Hỗ trợ sau mua</td>
        <td>✅ Có nơi để quay lại</td>
        <td>❌ Người bán thường "mất tích" sau khi bán</td>
      </tr>
    </tbody>
  </table>

  <p><strong>Kết luận:</strong> Nếu bạn không phải dân kỹ thuật, chỉ nên mua iPhone cũ tại cửa hàng có địa chỉ rõ ràng. Khoản chênh 5-10% là phí bảo hiểm cho sự an tâm.</p>

  <!-- FAQ -->
  <h2>Câu hỏi thường gặp khi mua iPhone cũ</h2>

  <h3>Mua iPhone cũ nên kiểm tra gì đầu tiên?</h3>
  <p>Điều đầu tiên cần kiểm tra là ngoại hình máy (khung, màn hình, ốc vít) và màn hình xem có bị thay chưa. Sau đó kiểm tra Face ID/Touch ID, pin, camera, loa, mic. Cuối cùng kiểm tra IMEI để xác nhận máy không bị khóa iCloud, không phải máy lock.</p>

  <h3>iPhone cũ bao nhiêu phần trăm pin là tốt?</h3>
  <p>Pin iPhone cũ từ 85% trở lên được coi là tốt, dùng được 1-2 năm trước khi cần thay. Pin dưới 80% là yếu, nên thay pin mới ngay. Chi phí thay pin iPhone tại Anh Táo Mobile từ 350.000đ đến 700.000đ tùy dòng máy, lấy liền 45 phút.</p>

  <h3>Làm sao biết iPhone cũ có bị thay màn hình chưa?</h3>
  <p>Có 3 cách: (1) So màu viền màn hình trong tối — màn zin viền đen tuyền, màn thay hơi xám; (2) Soi dưới ánh sáng mạnh — màn zin phản chiếu đều; (3) Vào Cài đặt → Cài đặt chung → Giới thiệu — nếu có cảnh báo linh kiện không chính hãng là đã thay.</p>

  <h3>Mua iPhone cũ ở đâu uy tín tại Bình Dương?</h3>
  <p>Anh Táo Mobile tại 1013 Cách Mạng Tháng 8, Thủ Dầu Một, Bình Dương là địa chỉ chuyên iPhone cũ uy tín. Cam kết máy đẹp, kiểm tra kỹ, bảo hành main 12 tháng 1 đổi 1, pin 60 tháng. Có hỗ trợ thu cũ đổi mới và trả góp 0%.</p>

  <h3>Có nên mua iPhone cũ đã qua sửa chữa không?</h3>
  <p>Tùy vào linh kiện đã thay. Nếu chỉ thay pin hoặc ép kính (linh kiện hao mòn), vẫn nên mua vì giá rẻ hơn. Nhưng nếu đã thay màn hình, thay main, thay camera — nên cân nhắc vì chất lượng phụ thuộc hoàn toàn vào tay nghề thợ. Mua tại cửa hàng có bảo hành rõ ràng sẽ an toàn hơn rất nhiều.</p>

  <!-- CTA -->
  <div class="cta-box">
    <h2>Mua iPhone cũ tại Anh Táo Mobile — kiểm tra miễn phí, bảo hành rõ ràng</h2>
    <p>Nếu bạn không muốn tự kiểm tra từng bước như trên, hãy đến Anh Táo Mobile. Chúng tôi sẽ kiểm tra máy trước mặt bạn, giải thích từng lỗi (nếu có) và tư vấn máy phù hợp với ngân sách.</p>

    <ul>
      <li>✅ Máy được kiểm tra 10 bước như trên trước khi bán</li>
      <li>✅ Bảo hành main 12 tháng — 1 đổi 1</li>
      <li>✅ Bảo hành pin 60 tháng</li>
      <li>✅ <a href="https://anhtaomobile.com/thu-cu-doi-moi/">Thu cũ đổi mới</a> — lên đời iPhone, bù tiền hợp lý</li>
      <li>✅ <a href="https://anhtaomobile.com/tra-gop/">Trả góp 0%</a> qua thẻ tín dụng — chỉ cần CMND</li>
      <li>✅ <a href="https://anhtaomobile.com/sua-chua/">Sửa chữa lấy liền</a> — thay pin, thay màn hình trong 45 phút</li>
    </ul>

    <p>📍 <strong>Địa chỉ:</strong> 1013 Cách Mạng Tháng 8, P. Phú Cường, Thủ Dầu Một, Bình Dương</p>
    <p>📞 <strong>Hotline / Zalo:</strong> <a href="tel:0819000011">0819.000.011</a></p>
    <p>🕗 <strong>Giờ mở cửa:</strong> 8h30 - 21h (cả tuần)</p>
    <p>🌐 <strong>Website:</strong> <a href="https://anhtaomobile.com">anhtaomobile.com</a></p>

    <a href="https://anhtaomobile.com/san-pham/" class="cta-button">Xem máy đang bán →</a>
    <a href="https://anhtaomobile.com/sua-chua/" class="cta-button secondary">Đặt lịch sửa chữa →</a>
  </div>

  <!-- Tác giả -->
  <div class="author-box">
    <p><strong>Bài viết bởi:</strong> Anh Táo — Founder Anh Táo Mobile. Hơn 5 năm kinh nghiệm trong lĩnh vực mua bán và sửa chữa iPhone tại Bình Dương. Từng xử lý 10.000+ máy, hiểu rõ từng dòng iPhone từ linh kiện đến giá thị trường.</p>
    <p><em>Cập nhật lần cuối: 12/07/2026</em></p>
  </div>

</article>`,
      metaTitle: "Cách Mua iPhone Cũ Không Bị Lỗi — Checklist 10 Bước (2026)",
      metaDescription: "Mua iPhone cũ cần kiểm tra gì? Checklist 10 bước từ A-Z: màn hình, pin, Face ID, IMEI, camera. Anh Táo Mobile Bình Dương — máy đẹp, bảo hành rõ ràng.",
      ogImage: "https://anhtaomobile.com/wp-content/uploads/2026/07/checklist-mua-iphone-cu.jpg",
    },
  ];

  for (const p of seoPages) {
    await prisma.seoPage.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, published: true },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
