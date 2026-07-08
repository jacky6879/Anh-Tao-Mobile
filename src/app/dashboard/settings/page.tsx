import { auth } from "@/auth";
import { DashboardActions } from "@/components/DashboardActions";

export default async function DashboardSettingsPage() {
  const session = await auth();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">Cài đặt tài khoản</h2>
      <div className="surface-card p-4">
        <p className="text-sm mb-1">Email</p>
        <p className="font-medium">{session?.user.email}</p>
      </div>
      <div className="surface-card p-4 flex flex-col gap-2">
        <p className="font-medium">Quyền riêng tư (GDPR / NĐ 13)</p>
        <DashboardActions />
      </div>
    </div>
  );
}
