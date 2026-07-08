import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=" + encodeURIComponent("/dashboard"));
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=" + encodeURIComponent("/admin"));
  if (!session.user.isAdmin) redirect("/");
  return session;
}

export async function getCurrentDbUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}
