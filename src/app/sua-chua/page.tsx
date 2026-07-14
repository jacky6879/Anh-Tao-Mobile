import Link from "next/link";
import { prisma } from "@/lib/db";
import { RepairListClient } from "./RepairListClient";

// DB-backed content; render per request (DB not available at build time on Vercel)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sửa chữa iPhone, iPad — thay pin, màn hình, ép kính lấy liền",
  description: "Dịch vụ sửa chữa điện thoại tại Anh Táo Mobile: thay pin, thay màn hình, ép kính, thay chân sạc, sửa main — lấy liền, bảo hành rõ ràng.",
  alternates: { canonical: "/sua-chua" },
};

export default async function RepairPage() {
  let services: Awaited<ReturnType<typeof list>> = [];
  try { services = await list(); } catch { /* DB */ }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Dịch vụ sửa chữa</h1>
      <p className="text-secondary-token text-sm mb-6">Thay pin, thay màn hình, ép kính, thay chân sạc — lấy liền, bảo hành rõ ràng.</p>

      <RepairListClient services={services} />

      <div className="surface-card p-6 mt-8 text-center">
        <p className="font-semibold mb-2">Không thấy lỗi của máy?</p>
        <Link href="/dat-lich-sua-chua" className="btn btn-primary">Đặt lịch kiểm tra miễn phí</Link>
      </div>
    </div>
  );
}

async function list() {
  return prisma.repairService.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: [{ featured: "desc" }, { priceMin: "asc" }],
    select: { 
      id: true, 
      slug: true, 
      title: true, 
      shortDescription: true, 
      serviceGroup: true, 
      priceMin: true, 
      priceMax: true, 
      estimatedTime: true,
      deviceModel: true,
      partType: true
    },
  });
}


