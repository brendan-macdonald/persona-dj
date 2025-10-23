import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 *
 * Prevents multiple Prisma Client instances in development (hot reload)
 * and ensures proper connection pooling in production (serverless)
 *
 * Usage: import { prisma } from '@/lib/prisma'
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
