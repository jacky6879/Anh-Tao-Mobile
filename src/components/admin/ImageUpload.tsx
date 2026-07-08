"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";

type Props = {
  name: string;
  value: string | string[];
  onChange: (urls: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
};

export function ImageUpload({
  name,
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  label,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      const newUrls: string[] = [];

      const filesToUpload = Array.from(files).slice(
        0,
        multiple ? maxFiles - urls.length : 1,
      );

      for (const file of filesToUpload) {
        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/media", {
            method: "POST",
            body: fd,
          });
          if (res.ok) {
            const data = await res.json();
            newUrls.push(data.url);
          }
        } catch (e) {
          console.error("Upload failed:", e);
        }
      }

      if (multiple) {
        onChange([...urls, ...newUrls]);
      } else {
        onChange(newUrls[0] || value);
      }
      setUploading(false);
    },
    [urls, multiple, maxFiles, onChange, value],
  );

  const removeUrl = (idx: number) => {
    if (multiple) {
      const next = urls.filter((_, i) => i !== idx);
      onChange(next);
    } else {
      onChange("");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {label && <label className="text-sm font-medium">{label}</label>}

      {/* Thumbnails */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          {urls.map((url, i) => (
            <div
              key={i}
              className="relative group w-20 h-20 rounded-lg overflow-hidden border border-[var(--border-default)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {(multiple ? urls.length < maxFiles : urls.length === 0) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            transition-colors duration-200
            ${
              dragOver
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                : "border-[var(--border-default)] hover:border-[var(--brand-primary)]"
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-token">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Đang tải lên...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-token">
              <Upload className="w-6 h-6" />
              <span className="text-sm">
                Kéo thả ảnh hoặc{" "}
                <span className="text-[var(--brand-primary)] font-medium">
                  nhấn để chọn
                </span>
              </span>
              <span className="text-xs">
                JPEG, PNG, WebP, GIF — tối đa 5MB
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Hidden inputs for form submission — join by newline for backward compat */}
      {multiple ? (
        <input type="hidden" name={name} value={urls.join("\n")} />
      ) : (
        <input type="hidden" name={name} value={urls[0] || ""} />
      )}
    </div>
  );
}
