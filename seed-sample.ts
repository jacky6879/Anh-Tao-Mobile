import { prisma } from "./src/lib/db";

async function main() {
  // Create sample category
  const category = await prisma.category.upsert({
    where: { slug: "iphone-cu" },
    update: {},
    create: {
      name: "iPhone Cũ",
      slug: "iphone-cu",
      description: "iPhone cũ đẹp 99%, zin nguyên bản.",
    },
  });

  // Create sample products
  await prisma.product.upsert({
    where: { slug: "iphone-14-pro-max-128gb-cu-99" },
    update: {},
    create: {
      title: "iPhone 14 Pro Max 128GB Cũ 99%",
      slug: "iphone-14-pro-max-128gb-cu-99",
      price: 18990000,
      comparePrice: 20990000,
      brand: "Apple",
      condition: "percent99",
      stock: 5,
      status: "published",
      featured: true,
      categoryId: category.id,
      installment: true,
      warranty: "Bảo hành 6 tháng",
      shortDescription: "Máy đẹp keng 99%, pin cao, nguyên bản chưa qua sửa chữa.",
      gallery: ["https://images.unsplash.com/photo-1678685887225-2c069001b97b?w=800&q=80"],
      coverImage: "https://images.unsplash.com/photo-1678685887225-2c069001b97b?w=800&q=80",
    }
  });

  await prisma.product.upsert({
    where: { slug: "iphone-13-promax-256gb-cu-99" },
    update: {},
    create: {
      title: "iPhone 13 Pro Max 256GB Cũ 99%",
      slug: "iphone-13-promax-256gb-cu-99",
      price: 14500000,
      comparePrice: 15500000,
      brand: "Apple",
      condition: "percent99",
      stock: 3,
      status: "published",
      featured: true,
      categoryId: category.id,
      installment: true,
      warranty: "Bảo hành 6 tháng",
      shortDescription: "Màu Xanh siêu đẹp, pin 9x, dùng mượt mà mọi tác vụ.",
      gallery: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80"],
      coverImage: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80",
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
