import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET all alumni years
  if (req.method === "GET") {
    const years = await prisma.alumniYear.findMany({
      include: { members: true },
      orderBy: { year: "desc" },
    });
    return res.status(200).json(years);
  }

  // CREATE new alumni year
  if (req.method === "POST") {
    const { year, program, batch, batchYear } = req.body;

    if (!year) return res.status(400).json({ error: "Tahun wajib diisi" });

    const slug = `alumni-${year}`;

    const created = await prisma.alumniYear.create({
      data: {
        year: Number(year),
        slug,
        program: program || null,
        batch: batch || null,
        batchYear: batchYear ? Number(batchYear) : null,
      },
    });

    return res.status(201).json(created);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
