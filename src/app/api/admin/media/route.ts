import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { uploadPublicImage, deleteObject, PUBLIC_BUCKET } from "@/lib/storage";

export async function GET(req: NextRequest) {
  await requireAdmin();
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("q") || "";
  const pageSize = 24;

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [items, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((i) => ({ ...i, sizeBytes: Number(i.sizeBytes) })),
    total,
    pages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  await requireAdmin();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File quá lớn (tối đa 5MB)" },
      { status: 400 },
    );
  }

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận JPEG, PNG, WebP, GIF, SVG" },
      { status: 400 },
    );
  }

  const timestamp = Date.now();
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 100);
  const path = `uploads/${timestamp}-${safeName}`;

  const { url } = await uploadPublicImage(file, path);

  const asset = await prisma.mediaAsset.create({
    data: {
      name: file.name,
      url,
      path,
      mimeType: file.type,
      sizeBytes: BigInt(file.size),
      alt: (formData.get("alt") as string) || null,
    },
  });

  return NextResponse.json({ id: asset.id, url: asset.url, name: asset.name });
}

export async function DELETE(req: NextRequest) {
  await requireAdmin();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteObject(PUBLIC_BUCKET, asset.path);
  await prisma.mediaAsset.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
