import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CREATE MEMBER
  if (req.method === "POST") {
    const { yearId, name, description, periodStart, periodEnd } = req.body;

    if (!yearId || !name) {
      return res.status(400).json({ error: "yearId & name wajib diisi" });
    }

    const created = await prisma.alumniMember.create({
      data: {
        yearId: Number(yearId),
        name,
        description: description || null,
        periodStart: periodStart ? Number(periodStart) : null,
        periodEnd: periodEnd ? Number(periodEnd) : null,
      },
    });

    return res.status(201).json(created);
  }

  // UPDATE MEMBER
  if (req.method === "PUT") {
    const { id, name, description, periodStart, periodEnd } = req.body;

    if (!id) return res.status(400).json({ error: "ID wajib" });

    const updated = await prisma.alumniMember.update({
      where: { id: Number(id) },
      data: {
        name,
        description: description || null,
        periodStart: periodStart ? Number(periodStart) : null,
        periodEnd: periodEnd ? Number(periodEnd) : null,
      },
    });

    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
