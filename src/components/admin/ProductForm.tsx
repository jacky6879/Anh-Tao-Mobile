"use client";

import { useState } from "react";
import type { Category, Product } from "@prisma/client";
import { ImageUpload } from "./ImageUpload";

type Props = {
  action: (formData: FormData) => Promise<void>;
  product?: Product;
  categories: Pick<Category, "id" | "name">[];
};

export function ProductForm({ action, product, categories }: Props) {
  const p = product;
  const [coverImage, setCoverImage] = useState(p?.coverImage ?? "");
  const [gallery, setGallery] = useState<string[]>(p?.gallery ?? []);

  return (
    <form action={action} className="surface-card p-5 flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tên sản phẩm" name="title" defaultValue={p?.title} required />
        <Field label="Hãng" name="brand" defaultValue={p?.brand ?? ""} />
        <Field label="Model" name="model" defaultValue={p?.model ?? ""} />
        <Field label="Dung lượng" name="storage" defaultValue={p?.storage ?? ""} />
        <Field label="Màu" name="color" defaultValue={p?.color ?? ""} />
        <Select label="Tình trạng" name="condition" defaultValue={p?.condition ?? "unknown"} options={CONDITIONS} />
        <Field label="Pin (%)" name="batteryHealth" type="number" defaultValue={p?.batteryHealth ?? ""} />
        <Field label="Bảo hành" name="warranty" defaultValue={p?.warranty ?? ""} />
        <Field label="Giá (VND)" name="price" type="number" defaultValue={p?.price ?? 0} required />
        <Field label="Giá gạch ngang" name="comparePrice" type="number" defaultValue={p?.comparePrice ?? ""} />
        <Field label="Tồn kho" name="stock" type="number" defaultValue={p?.stock ?? 0} />
        <Select label="Danh mục" name="categoryId" defaultValue={p?.categoryId ?? ""} options={[{ value: "", label: "— Không —" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
        <Select label="Trạng thái" name="status" defaultValue={p?.status ?? "draft"} options={STATUSES} />
        <Field label="IMEI/Nguồn gốc" name="imeiStatus" defaultValue={p?.imeiStatus ?? ""} />
        <Field label="Xuất xứ" name="origin" defaultValue={p?.origin ?? ""} />
      </div>

      <div>
        <label className="text-sm font-medium">Mô tả ngắn</label>
        <textarea name="shortDescription" rows={2} className="input-token mt-1" defaultValue={p?.shortDescription ?? ""} />
      </div>
      <div>
        <label className="text-sm font-medium">Mô tả chi tiết (Markdown)</label>
        <textarea name="longDescription" rows={6} className="input-token mt-1 font-mono" defaultValue={p?.longDescription ?? ""} />
      </div>

      <ImageUpload
        name="coverImage"
        label="Ảnh bìa"
        value={coverImage}
        onChange={(v) => setCoverImage(v as string)}
      />

      <ImageUpload
        name="gallery"
        label="Bộ sưu tập ảnh"
        value={gallery}
        onChange={(v) => setGallery(v as string[])}
        multiple
        maxFiles={10}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tags (phẩy)" name="tags" defaultValue={p?.tags.join(", ") ?? ""} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Meta title (SEO)" name="metaTitle" defaultValue={p?.metaTitle ?? ""} />
        <Field label="Meta description" name="metaDescription" defaultValue={p?.metaDescription ?? ""} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="installment" defaultChecked={p?.installment ?? false} /> Hỗ trợ trả góp
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} /> Sản phẩm nổi bật
      </label>

      <button type="submit" className="btn btn-primary w-fit">Lưu sản phẩm</button>
    </form>
  );
}

const CONDITIONS = [
  { value: "new_seal", label: "New Seal" }, { value: "like_new", label: "Like New" },
  { value: "percent99", label: "99%" }, { value: "used", label: "Đã dùng" },
  { value: "light_scratch", label: "Trầy nhẹ" }, { value: "repaired", label: "Đã sửa chữa" },
  { value: "unknown", label: "Không xác định" },
];
const STATUSES = [
  { value: "draft", label: "Nháp" }, { value: "published", label: "Đăng" }, { value: "archived", label: "Lưu trữ" },
];

function Field({ label, name, type = "text", defaultValue, required }: { label: string; name: string; type?: string; defaultValue?: string | number; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && " *"}</label>
      <input name={name} type={type} defaultValue={defaultValue} required={required} className="input-token mt-1" />
    </div>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select name={name} defaultValue={defaultValue} className="input-token mt-1">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
