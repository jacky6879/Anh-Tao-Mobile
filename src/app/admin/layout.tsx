import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-helpers";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: { absolute: "Quản trị — Anh Táo Mobile" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (session.user.status === "blocked") redirect("/");

  return (
    <div className="min-h-screen surface-page">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
