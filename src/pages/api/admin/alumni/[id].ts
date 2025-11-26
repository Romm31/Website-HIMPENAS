import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "ID tidak valid" });

  // GET detail alumni year
  if (req.method === "GET") {
    const year = await prisma.alumniYear.findUnique({
      where: { id: Number(id) },
      include: { members: true },
    });

    if (!year) return res.status(404).json({ error: "Data tidak ditemukan" });

    return res.status(200).json(year);
  }

  // UPDATE alumni year
  if (req.method === "PUT") {
    const { year, program, batch, batchYear } = req.body;

    const updated = await prisma.alumniYear.update({
      where: { id: Number(id) },
      data: {
        year: Number(year),
        program: program || null,
        batch: batch || null,
        batchYear: batchYear ? Number(batchYear) : null,
      },
    });

    return res.status(200).json(updated);
  }

  // DELETE alumni year
  if (req.method === "DELETE") {
    await prisma.alumniYear.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
