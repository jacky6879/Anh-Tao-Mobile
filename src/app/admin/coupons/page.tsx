import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { couponSchema } from "@/lib/schemas";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeAudit } from "@/lib/audit";
import { setFlash } from "@/lib/flash";
import { formatVND, formatDateTime } from "@/lib/format";
import { ProductActions } from "@/components/admin/RowActions";

export const metadata = { title: "Mã giảm giá — Quản trị" };

export default async function AdminCouponsPage() {
  let coupons: Awaited<ReturnType<typeof list>> = [];
  try { coupons = await list(); } catch { /* DB */ }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mã giảm giá</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="surface-subtle text-left text-muted-token">
              <tr><th className="p-3">Mã</th><th className="p-3">Loại</th><th className="p-3">Giá trị</th><th className="p-3">Đã dùng</th><th className="p-3">Hết hạn</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {coupons.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-token">Chưa có mã</td></tr>}
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-token">
                  <td className="p-3 font-mono">{c.code}</td>
                  <td className="p-3">{c.type === "percent" ? "%" : "VND"}</td>
                  <td className="p-3">{c.type === "percent" ? `${c.value}%` : formatVND(c.value)}</td>
                  <td className="p-3">{c.usageCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                  <td className="p-3 text-muted-token">{c.expiresAt ? formatDateTime(c.expiresAt) : "—"}</td>
                  <td className="p-3"><ProductActions editHref={`/admin/coupons?edit=${c.id}`} deleteAction={deleteCoupon.bind(null, c.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={createCoupon} className="surface-card p-4 flex flex-col gap-3 h-fit">
          <h2 className="font-semibold">Thêm mã</h2>
          <input name="code" placeholder="VD: ANHTAO10" required className="input-token" />
          <select name="type" className="input-token">
            <option value="percent">Phần trăm (%)</option>
            <option value="fixed">Số tiền (VND)</option>
          </select>
          <input name="value" type="number" placeholder="Giá trị" required className="input-token" />
          <input name="minOrderAmount" type="number" placeholder="Đơn tối thiểu" className="input-token" />
          <input name="maxDiscount" type="number" placeholder="Giảm tối đa" className="input-token" />
          <input name="usageLimit" type="number" placeholder="Giới hạn lượt dùng" className="input-token" />
          <input name="expiresAt" type="date" className="input-token" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked /> Kích hoạt</label>
          <button className="btn btn-primary">Thêm mã</button>
        </form>
      </div>
    </div>
  );
}

async function list() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, code: true, type: true, value: true, usageCount: true, usageLimit: true, expiresAt: true, active: true } });
}

export async function createCoupon(formData: FormData) {
  "use server";
  const session = await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = couponSchema.parse({ ...raw, productIds: [] });
  await prisma.coupon.create({
    data: {
      code: parsed.code!.toUpperCase(),
      description: parsed.description,
      type: parsed.type,
      value: parsed.value,
      minOrderAmount: parsed.minOrderAmount ?? null,
      maxDiscount: parsed.maxDiscount ?? null,
      usageLimit: parsed.usageLimit ?? null,
      perUserLimit: parsed.perUserLimit ?? null,
      productIds: [],
      startsAt: parsed.startsAt ? new Date(parsed.startsAt) : null,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      active: parsed.active,
    },
  });
  await writeAudit({ userId: session.user.id, action: "create", entityType: "Coupon", entityId: parsed.code!, metadata: {} });
  revalidatePath("/admin/coupons");
  await setFlash({ type: "success", message: "Đã tạo mã giảm giá" });
}

export async function deleteCoupon(id: string) {
  "use server";
  const session = await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  await writeAudit({ userId: session.user.id, action: "delete", entityType: "Coupon", entityId: id, metadata: {} });
  revalidatePath("/admin/coupons");
  await setFlash({ type: "success", message: "Đã xoá mã" });
}
