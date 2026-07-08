import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { updateService } from "../actions";

export const metadata = { title: "Sửa dịch vụ — Quản trị" };

type Params = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Params) {
  const { id } = await params;
  let service;
  try { service = await prisma.repairService.findUnique({ where: { id } }); } catch { /* DB */ }
  if (!service) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sửa: {service.title}</h1>
        <Link href="/admin/repair-services" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <ServiceForm action={updateService.bind(null, id)} service={service} />
    </div>
  );
}
