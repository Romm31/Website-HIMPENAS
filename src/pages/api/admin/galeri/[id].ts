import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  try {
    if (req.method === "GET") {
      const album = await prisma.galleryAlbum.findUnique({
        where: { id },
        include: { mediaItems: true },
      });
      if (!album) return res.status(404).json({ error: "Album tidak ditemukan" });
      return res.status(200).json(album);
    }

    if (req.method === "PUT") {
      const { title, description, coverImageUrl } = req.body;
      const album = await prisma.galleryAlbum.update({
        where: { id },
        data: { title, description, coverImageUrl },
      });
      return res.status(200).json(album);
    }

    if (req.method === "DELETE") {
      await prisma.galleryAlbum.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Metode tidak diizinkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
