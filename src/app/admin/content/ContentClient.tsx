"use client";

import { useState, useTransition } from "react";
import { savePageContent } from "./actions";
import {
  PAGE_CONTENT_LABELS,
  type PageContent,
  type PageContentKey,
} from "@/lib/page-content";

const PAGE_PATHS: Record<PageContentKey, string> = {
  "bao-hanh": "/bao-hanh",
  "thu-cu-doi-moi": "/thu-cu-doi-moi",
  "tra-gop": "/tra-gop",
};

export function ContentClient({
  initial,
}: {
  initial: Record<PageContentKey, PageContent>;
}) {
  const pageKeys = Object.keys(initial) as PageContentKey[];
  const [active, setActive] = useState<PageContentKey>(pageKeys[0] ?? "bao-hanh");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {pageKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              active === key
                ? "bg-[var(--brand-primary)] text-white"
                : "surface-card hover:bg-[var(--bg-subtle)]"
            }`}
          >
            {PAGE_CONTENT_LABELS[key]}
          </button>
        ))}
      </div>

      {pageKeys.map((key) => (
        <div key={key} hidden={active !== key}>
          <PageEditor pageKey={key} initial={initial[key]} />
        </div>
      ))}
    </div>
  );
}

function PageEditor({
  pageKey,
  initial,
}: {
  pageKey: PageContentKey;
  initial: PageContent;
}) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<PageContent>(initial);
  const [msg, setMsg] = useState("");

  const handleChange = (field: keyof PageContent, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    startTransition(async () => {
      try {
        await savePageContent(pageKey, data);
        setMsg("✅ Đã lưu nội dung thành công!");
      } catch {
        setMsg("❌ Có lỗi xảy ra khi lưu.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card p-6 max-w-3xl flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg">{PAGE_CONTENT_LABELS[pageKey]}</h3>
        <a
          href={PAGE_PATHS[pageKey]}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[var(--brand-primary)] hover:underline"
        >
          Xem trang ↗
        </a>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Tiêu đề chính (H1)</label>
        <input
          className="input"
          value={data.h1}
          onChange={(e) => handleChange("h1", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Mô tả ngắn (dưới tiêu đề)</label>
        <textarea
          className="input min-h-[70px]"
          value={data.intro}
          onChange={(e) => handleChange("intro", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Nội dung chi tiết (HTML)</label>
        <p className="text-xs text-[var(--text-muted)] mb-1">
          Dùng các thẻ như &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt; để định dạng.
        </p>
        <textarea
          className="input min-h-[260px] font-mono text-sm"
          value={data.bodyHtml}
          onChange={(e) => handleChange("bodyHtml", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Tiêu đề khối kêu gọi (CTA)</label>
        <input
          className="input"
          value={data.ctaTitle}
          onChange={(e) => handleChange("ctaTitle", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 border-t border-[var(--border)] pt-5">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Đang lưu..." : "💾 Lưu thay đổi"}
        </button>
        {msg && (
          <span
            className={`text-sm ${
              msg.startsWith("✅")
                ? "text-green-600 dark:text-green-400"
                : "text-red-500"
            }`}
          >
            {msg}
          </span>
        )}
      </div>
    </form>
  );
}
