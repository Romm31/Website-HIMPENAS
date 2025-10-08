import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const slide = await prisma.slide.findUnique({
        where: { id: Number(id) },
      });
      return res.status(200).json(slide);
    }

    if (req.method === "PUT") {
      const { title, imageUrl, order } = req.body;
      const updated = await prisma.slide.update({
        where: { id: Number(id) },
        data: { title, imageUrl, order: Number(order) },
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.slide.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: "Slide deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}
