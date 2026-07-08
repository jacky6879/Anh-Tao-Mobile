import { env, hasUpstash } from "@/lib/env";

/**
 * Rate limiting. Uses Upstash Redis fixed-window counter when configured,
 * otherwise falls back to an in-memory sliding window (per-instance, fine
 * for dev / single-instance deploys).
 */

export type RateLimitResult = { success: boolean; remaining: number; reset: number };

interface Limiter {
  limit: (identifier: string, limit: number, window: number) => Promise<RateLimitResult>;
}

const inMemory = new Map<string, { count: number; resetAt: number }>();

const memoryLimiter: Limiter = {
  async limit(identifier, limit, window) {
    const now = Date.now();
    const entry = inMemory.get(identifier);
    if (!entry || entry.resetAt < now) {
      inMemory.set(identifier, { count: 1, resetAt: now + window * 1000 });
      return { success: true, remaining: limit - 1, reset: now + window * 1000 };
    }
    entry.count += 1;
    const success = entry.count <= limit;
    return {
      success,
      remaining: Math.max(0, limit - entry.count),
      reset: entry.resetAt,
    };
  },
};

let upstashRedis: import("@upstash/redis").Redis | null = null;
async function getUpstash() {
  if (!upstashRedis) {
    const { Redis } = await import("@upstash/redis");
    upstashRedis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return upstashRedis;
}

const upstashLimiter: Limiter = {
  async limit(identifier, limit, window) {
    const redis = await getUpstash();
    const key = `rl:${identifier}:${Math.floor(Date.now() / (window * 1000))}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, window);
    const success = count <= limit;
    return {
      success,
      remaining: Math.max(0, limit - count),
      reset: Date.now() + window * 1000,
    };
  },
};

const limiter: Limiter = hasUpstash ? upstashLimiter : memoryLimiter;

export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  return limiter.limit(identifier, limit, windowSeconds);
}
