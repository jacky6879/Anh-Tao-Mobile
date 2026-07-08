"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Trash2, Check, Loader2, Image as ImageIcon } from "lucide-react";

type MediaItem = {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
};

export function MediaLibrary({
  open,
  onClose,
  onSelect,
  multiple = false,
}: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.pages);
      }
    } catch (e) {
      console.error("Failed to fetch media:", e);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelected(new Set());
    }
  }, [open, fetchMedia]);

  const toggleSelect = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        if (!multiple) next.clear();
        next.add(url);
      }
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá ảnh này?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
    setDeleting(null);
  };

  const handleInsert = () => {
    onSelect(Array.from(selected));
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative surface-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <h2 className="text-lg font-bold">Thư viện ảnh</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--surface-subtle)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--border-default)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-token" />
            <input
              type="text"
              placeholder="Tìm ảnh..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-token pl-9 w-full"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-token" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-token">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có ảnh nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                    ${
                      selected.has(item.url)
                        ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/30"
                        : "border-transparent hover:border-[var(--border-default)]"
                    }
                  `}
                  onClick={() => toggleSelect(item.url)}
                >
                  <div className="aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selected.has(item.url) && (
                    <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={deleting === item.id}
                  >
                    {deleting === item.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.name} ({formatSize(item.sizeBytes)})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-3 border-t border-[var(--border-default)]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn btn-secondary text-sm px-3 py-1"
            >
              ← Trước
            </button>
            <span className="text-sm text-muted-token">
              Trang {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn btn-secondary text-sm px-3 py-1"
            >
              Sau →
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border-default)]">
          <span className="text-sm text-muted-token">
            {selected.size > 0
              ? `Đã chọn ${selected.size} ảnh`
              : "Chọn ảnh để chèn"}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary">
              Huỷ
            </button>
            <button
              onClick={handleInsert}
              disabled={selected.size === 0}
              className="btn btn-primary"
            >
              Chèn ảnh đã chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
