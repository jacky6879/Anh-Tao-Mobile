"use client";

import { useState } from "react";
import type { Testimonial } from "@prisma/client";
import { ImageUpload } from "./ImageUpload";

type Props = {
  action: (formData: FormData) => Promise<void>;
  testimonial?: Testimonial;
};

export function TestimonialForm({ action, testimonial }: Props) {
  const t = testimonial;
  const [avatarImage, setAvatarImage] = useState(t?.avatarImage ?? "");
  const [photoImage, setPhotoImage] = useState(t?.photoImage ?? "");

  return (
    <form action={action} className="surface-card p-5 flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tên khách hàng" name="customerName" defaultValue={t?.customerName} required />
        <Field label="Sản phẩm / dịch vụ đã mua" name="productName" defaultValue={t?.productName ?? ""} />
        <Select
          label="Đánh giá (sao)"
          name="rating"
          defaultValue={String(t?.rating ?? 5)}
          options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} sao` }))}
        />
        <Select
          label="Trạng thái"
          name="status"
          defaultValue={t?.status ?? "published"}
          options={STATUSES}
        />
        <Field label="Thứ tự hiển thị" name="order" type="number" defaultValue={t?.order ?? 0} />
      </div>

      <div>
        <label className="text-sm font-medium">Nội dung đánh giá *</label>
        <textarea name="comment" rows={4} required className="input-token mt-1" defaultValue={t?.comment ?? ""} />
      </div>

      <ImageUpload
        name="avatarImage"
        label="Ảnh đại diện khách hàng (avatar)"
        value={avatarImage}
        onChange={(v) => setAvatarImage(v as string)}
      />

      <ImageUpload
        name="photoImage"
        label="Ảnh khách nhận máy / sản phẩm"
        value={photoImage}
        onChange={(v) => setPhotoImage(v as string)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={t?.featured ?? false} /> Ưu tiên hiển thị (nổi bật)
      </label>

      <button type="submit" className="btn btn-primary w-fit">Lưu đánh giá</button>
    </form>
  );
}

const STATUSES = [
  { value: "published", label: "Hiển thị" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "hidden", label: "Ẩn" },
];

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && " *"}</label>
      <input name={name} type={type} defaultValue={defaultValue} required={required} className="input-token mt-1" />
    </div>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select name={name} defaultValue={defaultValue} className="input-token mt-1">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
