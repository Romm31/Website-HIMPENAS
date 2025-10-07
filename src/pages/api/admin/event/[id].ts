import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const eventId = Number(id);

  try {
    if (req.method === "GET") {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
      return res.status(200).json(event);
    }

    if (req.method === "PUT") {
      const { judul, deskripsi, tanggal, lokasi } = req.body;
      const updated = await prisma.event.update({
        where: { id: eventId },
        data: { judul, deskripsi, tanggal: new Date(tanggal), lokasi },
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.event.delete({ where: { id: eventId } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
