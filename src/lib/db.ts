import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  __prisma?: PrismaClient;
};

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    // Serverless environments should not keep idle connections
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.__prisma ??
  (globalForPrisma.__prisma = createPrismaClient());

/**
 * Soft-delete filter helper. Pass into any Prisma `where` that supports
 * `deletedAt` to exclude tombstoned rows.
 */
export function notDeleted<T extends Record<string, unknown>>(where?: T) {
  return { deletedAt: null, ...(where as Record<string, unknown>) } as T & {
    deletedAt: null;
  };
}

