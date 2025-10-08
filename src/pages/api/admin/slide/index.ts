import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
      return res.status(200).json(slides);
    }

    if (req.method === "POST") {
      const { title, imageUrl, order } = req.body;

      if (!title || !imageUrl || !order) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      const newSlide = await prisma.slide.create({
        data: {
          title,
          imageUrl,
          order: Number(order),
        },
      });

      return res.status(201).json(newSlide);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("Slide error:", err);
    return res.status(500).json({ message: err.message });
  }
}
