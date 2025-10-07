import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const about = await prisma.about.findFirst();
      if (!about) {
        // buat otomatis kalau belum ada
        const created = await prisma.about.create({ data: { profile: "Tulis profil organisasi di sini..." } });
        return res.status(200).json(created);
      }
      return res.status(200).json(about);
    }

    if (req.method === "PUT") {
      const { profile } = req.body;
      if (!profile) return res.status(400).json({ message: "Profile tidak boleh kosong" });

      const existing = await prisma.about.findFirst();
      if (!existing) {
        const newAbout = await prisma.about.create({ data: { profile } });
        return res.status(201).json(newAbout);
      }

      const updated = await prisma.about.update({
        where: { id: existing.id },
        data: { profile },
      });

      return res.status(200).json(updated);
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
