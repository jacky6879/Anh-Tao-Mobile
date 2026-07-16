import { loadContent } from "./actions";
import { ContentClient } from "./ContentClient";

export const metadata = {
  title: "Nội dung trang",
};

// Content is DB-backed; render per request.
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const initial = await loadContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nội dung trang</h1>
        <p className="text-[var(--text-muted)]">
          Chỉnh sửa nội dung các trang thông tin: Bảo hành, Thu cũ đổi mới, Trả góp.
        </p>
      </div>
      <ContentClient initial={initial} />
    </div>
  );
}
