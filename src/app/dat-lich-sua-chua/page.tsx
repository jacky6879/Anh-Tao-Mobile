import { prisma } from "@/lib/db";
import { BookingForm } from "@/components/BookingForm";

// DB-backed content; render per request (DB not available at build time on Vercel)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Đặt lịch sửa chữa iPhone, iPad tại Bình Dương",
  description: "Đặt lịch sửa chữa điện thoại tại Anh Táo Mobile — thay pin, thay màn hình, ép kính. Nhân viên liên hệ xác nhận trong 30 phút.",
  alternates: { canonical: "/dat-lich-sua-chua" },
};

type Search = { searchParams: Promise<{ service?: string }> };

export default async function BookingPage({ searchParams }: Search) {
  const { service } = await searchParams;
  let services: { id: string; title: string }[] = [];
  try {
    services = await prisma.repairService.findMany({
      where: { status: "published", deletedAt: null },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    });
  } catch { /* DB */ }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Đặt lịch sửa chữa</h1>
      <p className="text-secondary-token text-sm mb-6">Điền thông tin, nhân viên Anh Táo liên hệ xác nhận lịch trong 30 phút.</p>
      <BookingForm serviceId={service} services={services} />
    </div>
  );
}
