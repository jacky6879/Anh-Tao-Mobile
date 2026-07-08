import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { env } from "@/lib/env";

export function hashIp(ip: string, salt: string = env.IP_SALT): string {
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function getHashedIp(): Promise<string> {
  return hashIp(await getClientIp());
}

export function getUserAgent(): Promise<string | null> {
  return headers().then((h) => h.get("user-agent"));
}
