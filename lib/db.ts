import { PrismaClient } from "@prisma/client"

// Evitamos múltiples instancias de Prisma Client en desarrollo
// debido al Hot Reloading de Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Opcional: Esto te mostrará las consultas SQL en la terminal (útil para debug)
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db