import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "ID tidak valid" });

  // DELETE MEMBER
  if (req.method === "DELETE") {
    await prisma.alumniMember.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
