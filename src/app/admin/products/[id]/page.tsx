import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export const metadata = { title: "Sửa sản phẩm — Quản trị" };

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  let product;
  let categories: { id: string; name: string }[] = [];
  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { order: "asc" } }),
    ]);
  } catch { /* DB */ }

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sửa: {product.title}</h1>
        <Link href="/admin/products" className="btn btn-ghost">← Quay lại</Link>
      </div>
      <ProductForm action={updateProduct.bind(null, id)} product={product} categories={categories} />
    </div>
  );
}
