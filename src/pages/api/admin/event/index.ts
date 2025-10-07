import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const events = await prisma.event.findMany({
        orderBy: { tanggal: "desc" },
      });
      return res.status(200).json(events);
    }

    if (req.method === "POST") {
      const { judul, deskripsi, tanggal, lokasi } = req.body;

      if (!judul || !deskripsi || !tanggal || !lokasi)
        return res.status(400).json({ message: "Semua field wajib diisi" });

      const newEvent = await prisma.event.create({
        data: { judul, deskripsi, tanggal: new Date(tanggal), lokasi },
      });

      return res.status(201).json(newEvent);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
