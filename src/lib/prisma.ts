import { PrismaClient } from '@prisma/client';

declare global {
  // biar gak buat ulang client setiap reload dev
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
