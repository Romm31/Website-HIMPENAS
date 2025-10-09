import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID tidak valid" });

  try {
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
      return res.status(200).json(user);
    }

    if (req.method === "PUT") {
      const { email, password, name } = req.body;
      const data: any = { email, name };

      if (password && password.trim() !== "") {
        data.password = await bcrypt.hash(password, 10);
      }

      const updated = await prisma.user.update({
        where: { id },
        data,
      });

      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.user.delete({ where: { id } });
      return res.status(204).end();
    }

    res.status(405).json({ error: "Metode tidak diizinkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
