import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { expirePendingOrders } from "@/lib/orders";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (env.CRON_SECRET && auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const expired = await expirePendingOrders();
  return NextResponse.json({ ok: true, expired });
}
