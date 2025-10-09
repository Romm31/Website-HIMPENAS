import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(users);
    }

    if (req.method === "POST") {
      const { email, password, name } = req.body;

      if (!email || !password)
        return res.status(400).json({ error: "Email dan password wajib diisi" });

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return res.status(400).json({ error: "Email sudah terdaftar" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      return res.status(201).json(user);
    }

    res.status(405).json({ error: "Metode tidak diizinkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
