import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const items = await prisma.kategori.findMany({
        orderBy: { id: 'desc' },
        include: { _count: { select: { berita: true } } },
      });
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const { nama } = req.body as { nama?: string };
      const clean = (nama || '').trim();
      if (!clean) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

      const exists = await prisma.kategori.findFirst({ where: { nama: clean } });
      if (exists) return res.status(409).json({ message: 'Nama kategori sudah ada.' });

      const created = await prisma.kategori.create({ data: { nama: clean } });
      return res.status(201).json(created);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /kategori error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}
