// src/pages/api/admin/stats.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // JWT AUTH UNTUK IP PUBLIC (tanpa domain)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [
      totalBerita,
      totalEvent,
      totalAlbum,
      totalUser,
      totalKategori,
      beritaTerbaru,
      beritaPerKategori,
      eventTerbaru
    ] = await Promise.all([
      prisma.berita.count(),
      prisma.event.count(),
      prisma.galleryAlbum.count(),
      prisma.user.count(),
      prisma.kategori.count(),

      prisma.berita.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, judul: true, createdAt: true },
      }),

      prisma.kategori.findMany({
        select: {
          nama: true,
          _count: { select: { berita: true } }
        },
        orderBy: { nama: "asc" },
      }),

      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, judul: true, tanggal: true },
      }),
    ]);

    const chartData = beritaPerKategori.map((kategori) => ({
      nama: kategori.nama,
      jumlah: kategori._count.berita,
    }));

    return res.status(200).json({
      totalBerita,
      totalEvent,
      totalAlbum,
      totalUser,
      totalKategori,
      beritaTerbaru: beritaTerbaru.map((b) => ({
        id: b.id,
        judul: b.judul,
        createdAt: b.createdAt.toISOString(),
      })),
      beritaPerKategori: chartData,
      eventTerbaru: eventTerbaru.map((e) => ({
        id: e.id,
        judul: e.judul,
        tanggal: e.tanggal.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({
      error: "Failed to fetch statistics",
      details: error.message || "Unknown error",
    });
  }
}
