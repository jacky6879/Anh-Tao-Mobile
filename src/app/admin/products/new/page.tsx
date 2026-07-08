import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export const metadata = { title: "Thêm sản phẩm — Quản trị" };

export default async function NewProductPage() {
  let categories: { id: string; name: string }[] = [];
  try { categories = await prisma.category.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { order: "asc" } }); } catch { /* DB */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thêm sản phẩm</h1>
        <Link href="/admin/products" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
