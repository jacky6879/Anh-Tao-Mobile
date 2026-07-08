import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { reviewSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Đăng nhập để đánh giá" }, { status: 401 });

  const rl = await rateLimit(`review:${session.user.id}`, 5, 3600);
  if (!rl.success) return NextResponse.json({ error: "Quá nhiều đánh giá, thử lại sau" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Không hợp lệ" }, { status: 400 });

  const d = parsed.data;
  // Verified purchase check.
  const paidOrder = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ["paid", "confirmed"] },
      items: { some: { productId: d.productId } },
    },
    select: { id: true },
  });

  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId: d.productId, userId: session.user.id } },
  });
  if (existing) return NextResponse.json({ error: "Bạn đã đánh giá sản phẩm này" }, { status: 400 });

  await prisma.review.create({
    data: {
      productId: d.productId,
      userId: session.user.id,
      orderId: paidOrder?.id,
      rating: d.rating,
      title: d.title,
      body: d.body,
      verifiedPurchase: !!paidOrder,
      status: paidOrder ? "published" : "pending",
    },
  });

  // Recalc product aggregate rating.
  if (paidOrder) await recalcRating(d.productId);

  return NextResponse.json({ ok: true });
}

async function recalcRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, status: "published" },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating },
  });
}
