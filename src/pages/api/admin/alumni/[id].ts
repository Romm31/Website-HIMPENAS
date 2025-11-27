import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "ID tidak valid" });

  const alumniId = Number(id);

  // GET detail alumni year
  if (req.method === "GET") {
    const year = await prisma.alumniYear.findUnique({
      where: { id: alumniId },
      include: { members: true },
    });

    if (!year) return res.status(404).json({ error: "Data tidak ditemukan" });

    return res.status(200).json(year);
  }

  // UPDATE alumni year
  if (req.method === "PUT") {
    const { year, program, batch, batchYear } = req.body;

    if (!year) return res.status(400).json({ error: "Tahun wajib diisi" });

    const updated = await prisma.alumniYear.update({
      where: { id: alumniId },
      data: {
        year: Number(year),
        program: program || null,
        batch: batch || null,
        batchYear: batchYear ? Number(batchYear) : null,
      },
    });

    return res.status(200).json(updated);
  }

  // DELETE alumni year (hapus member dulu biar aman)
  if (req.method === "DELETE") {
    try {
      await prisma.alumniMember.deleteMany({
        where: { yearId: alumniId },
      });

      await prisma.alumniYear.delete({
        where: { id: alumniId },
      });

      return res.status(200).json({ message: "Deleted" });
    } catch (e) {
      console.error("DELETE ERROR:", e);
      return res.status(500).json({ error: "Gagal menghapus tahun alumni." });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
