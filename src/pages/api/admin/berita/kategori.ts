import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
      const kategori = await prisma.kategori.findMany({ orderBy: { nama: "asc" } });
      return res.status(200).json(kategori);
    }

    if (req.method === "POST") {
      const { nama } = req.body;
      if (!nama) return res.status(400).json({ message: "Nama kategori wajib diisi" });

      const existing = await prisma.kategori.findUnique({ where: { nama } });
      if (existing) return res.status(400).json({ message: "Kategori sudah ada" });

      const newKategori = await prisma.kategori.create({ data: { nama } });
      return res.status(201).json(newKategori);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API /kategori error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
