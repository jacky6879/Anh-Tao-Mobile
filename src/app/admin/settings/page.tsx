import { getSettings } from "./actions";
import { SettingsClient } from "./SettingsClient";

export const metadata = {
  title: "Cài đặt chung",
};

export default async function SettingsPage() {
  const settings = await getSettings();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt chung</h1>
        <p className="text-[var(--text-muted)]">
          Quản lý các thông tin hiển thị trên website (hotline, địa chỉ, slogan...).
        </p>
      </div>
      <SettingsClient defaultValues={settings} />
    </div>
  );
}
