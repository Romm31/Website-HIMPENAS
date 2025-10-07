import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validasi ID
  const beritaId = parseInt(id as string);
  if (isNaN(beritaId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    // ===== GET BERITA BY ID =====
    if (req.method === "GET") {
      const berita = await prisma.berita.findUnique({
        where: { id: beritaId },
        include: { kategori: true },
      });

      if (!berita) {
        return res.status(404).json({ error: "Not Found" });
      }

      // ✅ return selalu JSON
      return res.status(200).json(berita);
    }

    // ===== UPDATE BERITA =====
    if (req.method === "PUT") {
      const { judul, konten, gambarUrl, kategoriId } = req.body;

      const updated = await prisma.berita.update({
        where: { id: beritaId },
        data: {
          judul,
          konten,
          gambarUrl,
          kategoriId: kategoriId ? Number(kategoriId) : null,
        },
      });

      return res.status(200).json(updated);
    }

    // ===== DELETE BERITA =====
    if (req.method === "DELETE") {
      await prisma.berita.delete({ where: { id: beritaId } });
      return res.status(200).json({ message: "Deleted successfully" });
    }

    // ===== METHOD NOT ALLOWED =====
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err: any) {
    console.error("❌ API ERROR:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
}
