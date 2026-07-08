"use client";

import { useState, useTransition } from "react";
import { saveBlog } from "../actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

export function BlogForm({ initialData, id }: { initialData: any; id: string }) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(
    initialData || {
      title: "",
      slug: "",
      h1: "",
      body: "",
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      published: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      saveBlog(id, data);
    });
  };

  const handleTitleChange = (val: string) => {
    // Tự động tạo slug nếu là bài mới
    if (id === "new") {
      const slug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setData({ ...data, title: val, slug, h1: val, metaTitle: val });
    } else {
      setData({ ...data, title: val });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6 max-w-4xl flex flex-col gap-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Tiêu đề bài viết <span className="text-red-500">*</span></label>
          <input required className="input" value={data.title} onChange={(e) => handleTitleChange(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span></label>
          <input required className="input" value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Thẻ H1 (Tùy chọn)</label>
        <input className="input" value={data.h1 || ""} onChange={(e) => setData({ ...data, h1: e.target.value })} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Ảnh đại diện (og:image)</label>
        <ImageUpload
          name="ogImage"
          value={data.ogImage || ""}
          onChange={(url) => setData({ ...data, ogImage: url as string })}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Nội dung HTML <span className="text-red-500">*</span></label>
        <p className="text-xs text-[var(--text-muted)] mb-2">Hỗ trợ viết bằng mã HTML trực tiếp.</p>
        <textarea 
          required
          className="input min-h-[300px] font-mono text-sm" 
          value={data.body || ""} 
          onChange={(e) => setData({ ...data, body: e.target.value })} 
        />
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <h3 className="font-medium mb-4">Tối ưu SEO</h3>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Meta Title</label>
            <input className="input" value={data.metaTitle || ""} onChange={(e) => setData({ ...data, metaTitle: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Meta Description</label>
            <textarea className="input" value={data.metaDescription || ""} onChange={(e) => setData({ ...data, metaDescription: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--border)] pt-4">
        <input type="checkbox" id="published" checked={data.published} onChange={(e) => setData({ ...data, published: e.target.checked })} />
        <label htmlFor="published" className="text-sm font-medium cursor-pointer">Xuất bản bài viết này (Công khai)</label>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Đang lưu..." : "Lưu bài viết"}
        </button>
      </div>
    </form>
  );
}
