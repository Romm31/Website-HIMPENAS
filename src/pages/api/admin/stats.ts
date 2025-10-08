// src/pages/api/admin/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Proteksi API, hanya admin yang bisa akses
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Menghitung total dari setiap model
      const totalBerita = await prisma.berita.count();
      const totalEvent = await prisma.event.count();
      const totalAlbum = await prisma.galleryAlbum.count();
      const totalUser = await prisma.user.count();
      const totalKategori = await prisma.kategori.count();

      // Mengambil 5 berita terbaru
      const beritaTerbaru = await prisma.berita.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          judul: true,
          createdAt: true,
        },
      });

      // Agregasi jumlah berita per kategori untuk grafik
      const beritaPerKategori = await prisma.kategori.findMany({
        include: {
          _count: {
            select: { berita: true },
          },
        },
      });
      
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