import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      let visi = await prisma.visi.findFirst();
      if (!visi) {
        visi = await prisma.visi.create({ data: { konten: "Tuliskan visi organisasi di sini..." } });
      }
      return res.status(200).json(visi);
    }

    if (req.method === "PUT") {
      const { konten } = req.body;
      let visi = await prisma.visi.findFirst();

      if (!visi) {
        visi = await prisma.visi.create({ data: { konten } });
      } else {
        visi = await prisma.visi.update({ where: { id: visi.id }, data: { konten } });
      }

      return res.status(200).json(visi);
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
