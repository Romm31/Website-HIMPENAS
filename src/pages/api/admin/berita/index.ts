import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const berita = await prisma.berita.findMany({
        include: { kategori: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(berita);
    }

    if (req.method === "POST") {
      const { judul, konten, gambarUrl, kategoriId } = req.body;

      const newBerita = await prisma.berita.create({
        data: {
          judul,
          konten,
          gambarUrl,
          kategoriId: kategoriId ? Number(kategoriId) : null,
        },
      });

      return res.status(201).json(newBerita);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
