// src/pages/api/admin/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// helper: coba hitung ke beberapa kandidat nama model, ambil yang ketemu duluan
async function countAny(candidates: string[]) {
  const client = prisma as any;
  for (const name of candidates) {
    const model = client[name];
    if (model && typeof model.count === "function") {
      try {
        return await model.count();
      } catch {
        // lanjut kandidat berikutnya
      }
    }
  }
  return 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Sesuaikan urutan kandidat sesuai kemungkinan penamaan di schema kamu
    const totalBerita = await countAny(["berita", "news", "post", "artikel", "article"]);
    const totalEvent = await countAny(["event", "events"]);
    // galeri kemungkinan ada di GalleryMedia / Upload / GalleryAlbum
    const totalGaleri = await countAny(["galleryMedia", "upload", "gallery", "galeri", "galleryAlbum"]);

    return res.status(200).json({
      berita: totalBerita,
      event: totalEvent,
      galeri: totalGaleri,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
