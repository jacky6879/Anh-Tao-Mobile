import { env, hasSupabase } from "@/lib/env";

/**
 * Storage abstraction.
 * - When Supabase is configured: uploads via Supabase Storage REST API (direct HTTP).
 * - Otherwise: saves files locally to public/uploads (dev fallback).
 */

export const PUBLIC_BUCKET = "product-covers";
export const PRIVATE_BUCKET = "product-assets";

// ─── Supabase Storage REST API (bypasses SDK JWT issues with new key format) ───

async function supabaseUpload(
  bucket: string,
  path: string,
  bytes: Buffer,
  contentType: string,
): Promise<string> {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const url = `${baseUrl}/storage/v1/object/${bucket}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: new Uint8Array(bytes),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Supabase upload failed (${res.status}): ${errBody}`);
  }

  // Public URL
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

async function supabaseDelete(bucket: string, path: string): Promise<void> {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const url = `${baseUrl}/storage/v1/object/${bucket}`;

  await fetch(url, {
    method: "DELETE",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [path] }),
  });
}

// ─── Local file storage (dev fallback) ───

async function localUpload(
  path: string,
  bytes: Buffer,
): Promise<string> {
  const fs = await import("fs");
  const fsPath = await import("path");
  const publicDir = fsPath.join(process.cwd(), "public");
  const fullPath = fsPath.join(publicDir, path);
  const dir = fsPath.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, bytes);
  return `/${path}`;
}

async function localDelete(path: string): Promise<void> {
  const fs = await import("fs");
  const fsPath = await import("path");
  const fullPath = fsPath.join(process.cwd(), "public", path);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

// ─── Public API ───

export async function uploadPublicImage(
  file: File,
  path: string,
): Promise<{ url: string; path: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());

  if (hasSupabase) {
    const url = await supabaseUpload(PUBLIC_BUCKET, path, bytes, file.type);
    return { url, path };
  }

  const url = await localUpload(path, bytes);
  return { url, path };
}

export async function deleteObject(bucket: string, path: string): Promise<void> {
  if (hasSupabase) {
    await supabaseDelete(bucket, path);
    return;
  }
  await localDelete(path);
}

