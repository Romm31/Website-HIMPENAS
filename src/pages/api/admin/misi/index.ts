import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Cuma ambil yang pertama, gak bikin baru
      const misi = await prisma.misi.findFirst();
      return res.status(200).json(misi ?? { konten: "Tuliskan misi organisasi di sini..." });
    }

    if (req.method === "PUT") {
      const { konten } = req.body;

      const misi = await prisma.misi.upsert({
        where: { id: 1 },
        update: { konten },
        create: { konten },
      });

      return res.status(200).json(misi);
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
