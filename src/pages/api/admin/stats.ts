// src/pages/api/admin/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const [
        totalBerita,
        totalEvent,
        totalAlbum,
        totalUser,
        totalKategori,
        beritaTerbaru,
        beritaPerKategori,
        eventTerbaru, // <-- TAMBAHKAN INI
      ] = await prisma.$transaction([
        prisma.berita.count(),
        prisma.event.count(),
        prisma.galleryAlbum.count(),
        prisma.user.count(),
        prisma.kategori.count(),
        prisma.berita.findMany({
          take: 4, // Ambil 4 berita terbaru
          orderBy: { createdAt: 'desc' },
          select: { id: true, judul: true, createdAt: true },
        }),
        prisma.kategori.findMany({
          include: { _count: { select: { berita: true } } },
        }),
        // ✅ LOGIKA BARU: Ambil 4 event terbaru
        prisma.event.findMany({
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: { id: true, judul: true, tanggal: true },
        }),
      ]);
      
      const chartData = beritaPerKategori.map(k => ({
        nama: k.nama,
        jumlah: k._count.berita,
      }));

      res.status(200).json({
        totalBerita,
        totalEvent,
        totalAlbum,
        totalUser,
        totalKategori,
        beritaTerbaru,
        beritaPerKategori: chartData,
        eventTerbaru, // <-- KIRIM DATA EVENT
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}