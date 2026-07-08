import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, orders, reviews, referrals] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true, createdAt: true, referralCode: true } }),
    prisma.order.findMany({ where: { userId: session.user.id }, include: { items: true } }),
    prisma.review.findMany({ where: { userId: session.user.id } }),
    prisma.referral.findMany({ where: { referrerId: session.user.id } }),
  ]);

  return NextResponse.json({ user, orders, reviews, referrals, exportedAt: new Date().toISOString() });
}

