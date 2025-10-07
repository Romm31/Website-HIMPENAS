import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const idNum = Number(req.query.id);
  if (!idNum || Number.isNaN(idNum)) return res.status(400).json({ message: 'ID tidak valid.' });

  try {
    if (req.method === 'GET') {
      const item = await prisma.kategori.findUnique({
        where: { id: idNum },
        include: { _count: { select: { berita: true } } },
      });
      if (!item) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
      return res.status(200).json(item);
    }

    if (req.method === 'PUT') {
      const { nama } = req.body as { nama?: string };
      const clean = (nama || '').trim();
      if (!clean) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

      const dup = await prisma.kategori.findFirst({
        where: { nama: clean, NOT: { id: idNum } },
      });
      if (dup) return res.status(409).json({ message: 'Nama kategori sudah ada.' });

      const updated = await prisma.kategori.update({
        where: { id: idNum },
        data: { nama: clean },
      });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const count = await prisma.berita.count({ where: { kategoriId: idNum } });
      if (count > 0) {
        return res.status(400).json({
          message: `Tidak bisa dihapus. Kategori sedang dipakai di ${count} berita.`,
        });
      }
      await prisma.kategori.delete({ where: { id: idNum } });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /kategori/[id] error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}
