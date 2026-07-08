import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hasUpstash } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  let db: "ok" | "fail" = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    db = "fail";
  }

  let redis: "ok" | "fail" | "off" = "off";
  if (hasUpstash) {
    try {
      await rateLimit("health", 1000, 1);
      redis = "ok";
    } catch {
      redis = "fail";
    }
  }

  return NextResponse.json({ db, redis, timestamp: new Date().toISOString() });
}
