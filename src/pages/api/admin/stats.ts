// src/pages/api/admin/stats.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all statistics in parallel
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
      // Total Berita
      prisma.berita.count(),

      // Total Event
      prisma.event.count(),

      // Total Album Galeri
      prisma.galleryAlbum.count(),

      // Total User/Admin
      prisma.user.count(),

      // Total Kategori
      prisma.kategori.count(),

      // 5 Berita Terbaru
      prisma.berita.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          judul: true,
          createdAt: true,
        },
      }),

      // Berita per Kategori (untuk chart)
      prisma.kategori.findMany({
        select: {
          nama: true,
          _count: {
            select: { berita: true },
          },
        },
        orderBy: { nama: 'asc' },
      }),

      // 5 Event Terbaru
      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          judul: true,
          tanggal: true,
        },
      }),
    ]);

    // Transform beritaPerKategori for chart
    const chartData = beritaPerKategori.map((kategori) => ({
      nama: kategori.nama,
      jumlah: kategori._count.berita,
    }));

    // Return statistics
    return res.status(200).json({
      totalBerita,
      totalEvent,
      totalAlbum,
      totalUser,
      totalKategori,
      beritaTerbaru: beritaTerbaru.map(b => ({
        id: b.id,
        judul: b.judul,
        createdAt: b.createdAt.toISOString(),
      })),
      beritaPerKategori: chartData,
      eventTerbaru: eventTerbaru.map(e => ({
        id: e.id,
        judul: e.judul,
        tanggal: e.tanggal.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}