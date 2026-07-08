import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogForm } from "./BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let initialData = null;
  if (id !== "new") {
    initialData = await prisma.seoPage.findUnique({ where: { id } });
    if (!initialData) return notFound();
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{id === "new" ? "Viết bài mới" : "Sửa bài viết"}</h1>
      </div>
      <BlogForm initialData={initialData} id={id} />
    </div>
  );
}
