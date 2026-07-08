import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const anonEmail = `deleted-${randomBytes(6).toString("hex")}@anonymized.local`;

  await prisma.$transaction([
    prisma.order.updateMany({ where: { userId }, data: { userId: null } }),
    prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), email: anonEmail, name: null, image: null, status: "blocked" },
    }),
  ]);

  await writeAudit({ userId, action: "delete", entityType: "User", entityId: userId, metadata: { anonymized: true } });

  return NextResponse.json({ ok: true });
}
