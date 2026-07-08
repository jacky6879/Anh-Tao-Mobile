import { prisma } from "../src/lib/db";
import { ProductCondition, ProductStatus } from "@prisma/client";

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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

  // Repair services
  const services = [
    {
      title: "Thay pin iPhone 12 Pro Max",
      deviceBrand: "Apple",
      deviceModel: "iPhone 12 Pro Max",
      serviceGroup: "Thay pin",
      partQuality: "Chính hãng",
      priceMin: 800000,
      priceMax: 1200000,
      warranty: "3 tháng",
      estimatedTime: "45 phút",
      shortDescription: "Thay pin chính hãng, lấy liền trong 45 phút.",
      featured: true,
    },
    {
      title: "Thay màn hình iPhone 13",
      deviceBrand: "Apple",
      deviceModel: "iPhone 13",
      serviceGroup: "Thay màn hình",
      partQuality: "OLED",
      priceMin: 2500000,
      priceMax: 3500000,
      warranty: "6 tháng",
      estimatedTime: "60 phút",
      shortDescription: "Thay màn hình OLED, cảm ứng mượt, màu chuẩn.",
      featured: true,
    },
    {
      title: "Ép kính iPhone 11",
      deviceBrand: "Apple",
      deviceModel: "iPhone 11",
      serviceGroup: "Ép kính",
      partQuality: "Kính cường lực",
      priceMin: 300000,
      priceMax: 500000,
      warranty: "3 tháng",
      estimatedTime: "30 phút",
      shortDescription: "Ép kính cường lực, trong suốt, không sùi mí.",
    },
    {
      title: "Thay chân sạc iPhone",
      deviceBrand: "Apple",
      deviceModel: "iPhone",
      serviceGroup: "Chân sạc",
      partQuality: "Chính hãng",
      priceMin: 400000,
      priceMax: 700000,
      warranty: "3 tháng",
      estimatedTime: "40 phút",
      shortDescription: "Thay chân sạc, sạc ổn định, không lỏng.",
    },
  ];

  for (const s of services) {
    await prisma.repairService.upsert({
      where: { slug: slugify(s.title) },
      update: {},
      create: {
        ...s,
        slug: slugify(s.title),
        status: ProductStatus.published,
        publishedAt: new Date(),
        tags: ["sua-chua", s.serviceGroup.toLowerCase()],
      },
    });
  }

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
