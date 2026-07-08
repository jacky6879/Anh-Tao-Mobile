"use client";

import { useState } from "react";
import type { RepairService } from "@prisma/client";
import { SERVICE_GROUPS } from "@/lib/service-groups";
import { ImageUpload } from "./ImageUpload";

const STATUSES = [
  { value: "draft", label: "Nháp" }, { value: "published", label: "Đăng" }, { value: "archived", label: "Lưu trữ" },
];

export function ServiceForm({ action, service }: { action: (formData: FormData) => Promise<void>; service?: RepairService }) {
  const s = service;
  const [coverImage, setCoverImage] = useState(s?.coverImage ?? "");

  return (
    <form action={action} className="surface-card p-5 flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tên dịch vụ" name="title" defaultValue={s?.title} required />
        <Select label="Nhóm dịch vụ" name="serviceGroup" defaultValue={s?.serviceGroup ?? "Thay pin"} options={SERVICE_GROUPS.map((g) => ({ value: g, label: g }))} />
        <Field label="Hãng thiết bị" name="deviceBrand" defaultValue={s?.deviceBrand ?? ""} />
        <Field label="Model" name="deviceModel" defaultValue={s?.deviceModel ?? ""} />
        <Field label="Loại linh kiện" name="partType" defaultValue={s?.partType ?? ""} />
        <Field label="Chất lượng linh kiện" name="partQuality" defaultValue={s?.partQuality ?? ""} />
        <Field label="Giá tối thiểu (VND)" name="priceMin" type="number" defaultValue={s?.priceMin ?? 0} required />
        <Field label="Giá tối đa (VND)" name="priceMax" type="number" defaultValue={s?.priceMax ?? 0} required />
        <Field label="Bảo hành" name="warranty" defaultValue={s?.warranty ?? ""} />
        <Field label="Thời gian" name="estimatedTime" defaultValue={s?.estimatedTime ?? ""} />
        <Select label="Trạng thái" name="status" defaultValue={s?.status ?? "draft"} options={STATUSES} />
      </div>

      <ImageUpload
        name="coverImage"
        label="Ảnh dịch vụ"
        value={coverImage}
        onChange={(v) => setCoverImage(v as string)}
      />

      <Field label="Mô tả ngắn" name="shortDescription" defaultValue={s?.shortDescription ?? ""} />
      <div>
        <label className="text-sm font-medium">Mô tả chi tiết (Markdown)</label>
        <textarea name="longDescription" rows={5} className="input-token mt-1 font-mono" defaultValue={s?.longDescription ?? ""} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tags (phẩy)" name="tags" defaultValue={s?.tags.join(", ") ?? ""} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={s?.featured ?? false} /> Dịch vụ nổi bật
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Meta title" name="metaTitle" defaultValue={s?.metaTitle ?? ""} />
        <Field label="Meta description" name="metaDescription" defaultValue={s?.metaDescription ?? ""} />
      </div>
      <button type="submit" className="btn btn-primary w-fit">Lưu dịch vụ</button>
    </form>
  );
}

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
