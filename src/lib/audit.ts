import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { AuditAction } from "@prisma/client";

export async function writeAudit(params: {
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: (params.metadata ?? {}) as Prisma.InputJsonValue,
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (e) {
    // Audit must never break the main flow.
    console.error("[audit] failed to write", e);
  }
}
