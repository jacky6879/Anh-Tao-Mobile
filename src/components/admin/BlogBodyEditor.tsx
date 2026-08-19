"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Upload,
  Loader2,
  ImagePlus,
  Library,
  Code2,
  PenLine,
  Bold,
  Italic,
  List,
  Heading2,
  Heading3,
  Pilcrow,
  Trash2,
} from "lucide-react";
import { MediaLibrary } from "./MediaLibrary";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Trình soạn thảo nội dung blog TRỰC QUAN (WYSIWYG).
 * - Thêm ảnh từ máy tính (kéo-thả hoặc nút chọn) → tự upload lên Cloudinary
 *   (nếu cấu hình NEXT_PUBLIC_CLOUDINARY_*), ngược lại lưu vào Thư viện ảnh.
 * - Ảnh hiển thị ngay trong bài; click vào ảnh để sửa mô tả (alt) hoặc xoá.
 * - Định dạng nhanh: đậm, nghiêng, H2, H3, đoạn văn, danh sách.
 * - Chế độ "Mã HTML" để chỉnh mã trực tiếp như trước.
 */
export function BlogBodyEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [imgBox, setImgBox] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [imgAlt, setImgAlt] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const selectedImg = useRef<HTMLImageElement | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Nạp nội dung ban đầu / khi chuyển về chế độ trực quan
  useEffect(() => {
    if (mode === "visual" && editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const emit = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const imageCount = useMemo(() => {
    const m = (value || "").match(/<img\b/gi);
    return m ? m.length : 0;
  }, [value]);

  const isEmpty = useMemo(() => {
    if (/<img\b/i.test(value || "")) return false;
    const text = (value || "").replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  }, [value]);

  /* ---------- Selection helpers ---------- */

  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(sel.anchorNode)
    ) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    } else {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const insertHtml = (html: string) => {
    const el = editorRef.current;
    if (!el) return;
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const exec = (cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  /* ---------- Image selection overlay ---------- */

  const clearImgSel = useCallback(() => {
    if (selectedImg.current) selectedImg.current.style.outline = "";
    selectedImg.current = null;
    setImgBox(null);
  }, []);

  const onEditorClick = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "IMG") {
      e.preventDefault();
      const img = t as HTMLImageElement;
      if (selectedImg.current && selectedImg.current !== img) {
        selectedImg.current.style.outline = "";
      }
      selectedImg.current = img;
      img.style.outline = "3px solid var(--brand-primary)";
      const wrap = wrapperRef.current?.getBoundingClientRect();
      const r = img.getBoundingClientRect();
      if (wrap) {
        setImgBox({
          top: r.top - wrap.top,
          left: r.left - wrap.left,
          width: r.width,
          height: r.height,
        });
      }
      setImgAlt(img.getAttribute("alt") || "");
    } else {
      clearImgSel();
    }
  };

  const deleteSelectedImg = () => {
    const img = selectedImg.current;
    if (!img) return;
    const fig = img.closest("figure");
    (fig || img).remove();
    clearImgSel();
    emit();
  };

  const applyAlt = (alt: string) => {
    setImgAlt(alt);
    if (selectedImg.current) {
      selectedImg.current.setAttribute("alt", alt);
      emit();
    }
  };

  /* ---------- Upload ---------- */

  const uploadOne = useCallback(
    async (file: File): Promise<string> => {
      if (!ALLOWED_TYPES.has(file.type)) {
        throw new Error("Chỉ chấp nhận JPEG, PNG, WebP, GIF hoặc SVG");
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Ảnh ${file.name} vượt quá giới hạn 5MB`);
      }

      let data: {
        url?: string;
        secure_url?: string;
        error?: { message?: string } | string;
      };
      if (cloudName && uploadPreset) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);
        fd.append("folder", "anh-tao/blog");
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: fd },
        );
        data = await res.json();
        if (!res.ok) {
          const msg =
            typeof data.error === "object" ? data.error?.message : undefined;
          throw new Error(msg || "Cloudinary upload thất bại");
        }
      } else {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: fd });
        data = await res.json();
        if (!res.ok) {
          const msg = typeof data.error === "string" ? data.error : "Upload thất bại";
          throw new Error(msg);
        }
      }
      const url = data.secure_url || data.url;
      if (!url) throw new Error("Không nhận được URL ảnh sau khi upload");
      return url;
    },
    [cloudName, uploadPreset],
  );

  const buildFigure = (url: string, alt: string) =>
    `<figure><img src="${url}" alt="${escapeAttr(alt)}" loading="lazy" /></figure><p><br></p>`;

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;
      setError("");
      setUploading(true);
      const parts: string[] = [];
      try {
        for (const file of Array.from(files)) {
          const url = await uploadOne(file);
          const alt = file.name.replace(/\.[^.]+$/, "");
          parts.push(buildFigure(url, alt));
        }
        insertHtml(parts.join(""));
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Upload ảnh thất bại";
        setError(message);
        console.error("Blog image upload failed:", uploadError);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadOne],
  );

  /* ---------- Mode switching ---------- */

  const switchMode = (m: "visual" | "html") => {
    if (m === mode) return;
    clearImgSel();
    setMode(m);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (mode === "visual") handleFiles(e.dataTransfer.files);
  };

  const toolBtn =
    "btn btn-secondary px-2.5 py-1.5 inline-flex items-center gap-1 text-sm";

  return (
    <div>
      {/* Thanh công cụ */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn btn-primary text-sm px-3 py-1.5 inline-flex items-center gap-1.5"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4" />
          )}
          {uploading ? "Đang tải ảnh lên..." : "Thêm ảnh từ máy tính"}
        </button>
        <button
          type="button"
          onClick={() => {
            saveSelection();
            setLibraryOpen(true);
          }}
          className={toolBtn}
        >
          <Library className="w-4 h-4" />
          Thư viện ảnh
        </button>

        <span className="w-px h-6 bg-[var(--border)] mx-1" />

        {mode === "visual" && (
          <>
            <button
              type="button"
              title="Đậm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("bold")}
              className={toolBtn}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Nghiêng"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("italic")}
              className={toolBtn}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Tiêu đề H2"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("formatBlock", "<h2>")}
              className={toolBtn}
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Tiêu đề H3"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("formatBlock", "<h3>")}
              className={toolBtn}
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Đoạn văn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("formatBlock", "<p>")}
              className={toolBtn}
            >
              <Pilcrow className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Danh sách"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec("insertUnorderedList")}
              className={toolBtn}
            >
              <List className="w-4 h-4" />
            </button>
          </>
        )}

        <span className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            {imageCount > 0 ? `${imageCount} ảnh trong bài` : "Chưa có ảnh trong bài"}
          </span>
          <button
            type="button"
            onClick={() => switchMode(mode === "visual" ? "html" : "visual")}
            className={toolBtn}
          >
            {mode === "visual" ? (
              <>
                <Code2 className="w-4 h-4" /> Mã HTML
              </>
            ) : (
              <>
                <PenLine className="w-4 h-4" /> Trực quan
              </>
            )}
          </button>
        </span>
      </div>

      {error && (
        <p className="mb-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div
        ref={wrapperRef}
        className={`relative rounded-lg transition-colors ${
          dragOver ? "ring-2 ring-[var(--brand-primary)]" : ""
        }`}
        onDragOver={(e) => {
          if (mode !== "visual") return;
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              clearImgSel();
              emit();
            }}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onClick={onEditorClick}
            className="input min-h-[320px] max-h-[600px] overflow-auto prose prose-blue dark:prose-invert max-w-none cursor-text"
          />
        ) : (
          <textarea
            className="input min-h-[320px] font-mono text-sm w-full"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Viết nội dung bằng mã HTML..."
          />
        )}

        {mode === "visual" && isEmpty && !uploading && (
          <div className="absolute inset-x-0 top-3 text-center text-sm text-[var(--text-muted)] pointer-events-none">
            Bấm vào đây để viết nội dung, hoặc bấm "Thêm ảnh từ máy tính" / kéo-thả ảnh vào vùng này.
          </div>
        )}

        {mode === "visual" && uploading && (
          <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 bg-[var(--surface-card,#fff)] rounded-lg px-4 py-2 shadow">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-primary)]" />
              <span className="text-sm font-medium">
                {cloudName ? "Đang tải ảnh lên Cloudinary..." : "Đang tải ảnh lên..."}
              </span>
            </div>
          </div>
        )}

        {mode === "visual" && dragOver && (
          <div className="absolute inset-0 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-[var(--brand-primary)] font-medium">
              <Upload className="w-5 h-5" />
              Thả ảnh để chèn vào bài
            </div>
          </div>
        )}

        {/* Overlay chỉnh ảnh đang chọn */}
        {mode === "visual" && imgBox && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: imgBox.top,
              left: imgBox.left,
              width: imgBox.width,
              height: imgBox.height,
            }}
          >
            <div className="absolute -top-11 left-0 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-card,#fff)] px-2 py-1.5 shadow-lg pointer-events-auto">
              <input
                value={imgAlt}
                onChange={(e) => applyAlt(e.target.value)}
                placeholder="Mô tả ảnh (alt) cho SEO"
                className="input h-7 text-xs w-52"
              />
              <button
                type="button"
                onClick={deleteSelectedImg}
                className="btn px-2 py-1 text-xs inline-flex items-center gap-1 bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xoá ảnh
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--text-muted)] mt-2">
        Ảnh thêm vào sẽ tự upload lên Cloudinary và hiển thị ngay trong bài. Bấm vào một ảnh để sửa mô tả (alt) hoặc xoá ảnh. Dùng nút "Mã HTML" nếu cần chỉnh mã trực tiếp.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <MediaLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={(urls) =>
          insertHtml(urls.map((u) => buildFigure(u, "")).join(""))
        }
        multiple
      />
    </div>
  );
}
