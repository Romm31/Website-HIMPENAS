import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const albumId = Number(req.query.albumId);
  const uploadDir = path.join(process.cwd(), "public/uploads/galeri");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  try {
    // GET semua media
    if (req.method === "GET") {
      const media = await prisma.galleryMedia.findMany({
        where: { albumId },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(media);
    }

    // POST upload media
    if (req.method === "POST") {
      const form = formidable({
        multiples: true,
        uploadDir,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: "Upload gagal" });

        const uploadedFiles = Array.isArray(files.media)
          ? files.media
          : [files.media];

        const saved = await Promise.all(
          uploadedFiles.map(async (f: any) => {
            const filename = path.basename(f.filepath);
            const url = `/uploads/galeri/${filename}`;
            const type = f.mimetype?.startsWith("video") ? "VIDEO" : "IMAGE";

            return prisma.galleryMedia.create({
              data: { albumId, url, type },
            });
          })
        );

        return res.status(201).json(saved);
      });
      return;
    }

    // DELETE media by id
    if (req.method === "DELETE") {
      const mid = Number(req.query.mid);
      const media = await prisma.galleryMedia.findUnique({ where: { id: mid } });
      if (!media) return res.status(404).json({ error: "Media tidak ditemukan" });

      const filePath = path.join(process.cwd(), "public", media.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await prisma.galleryMedia.delete({ where: { id: mid } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Metode tidak diizinkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
