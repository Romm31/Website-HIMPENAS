import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), "public/uploads/galeri");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  try {
    // GET semua album
    if (req.method === "GET") {
      const albums = await prisma.galleryAlbum.findMany({
        include: { mediaItems: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(albums);
    }

    // POST tambah album baru
    if (req.method === "POST") {
      const form = formidable({
        multiples: false,
        uploadDir,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: "Gagal upload file" });

        const title = (fields.title?.toString() ?? "").trim();
        const description = fields.description?.toString() ?? "";

        const file = (files.cover as any)?.[0] || files.cover;
        if (!file) return res.status(400).json({ error: "File cover wajib diisi" });

        const filename = path.basename(file.filepath);
        const coverImageUrl = `/uploads/galeri/${filename}`;

        if (!title) return res.status(400).json({ error: "Judul wajib diisi" });

        const album = await prisma.galleryAlbum.create({
          data: { title, description, coverImageUrl },
        });

        return res.status(201).json(album);
      });
      return;
    }

    return res.status(405).json({ error: "Metode tidak diizinkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
