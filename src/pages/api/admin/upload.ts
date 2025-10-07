import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files, File } from "formidable";
import fs from "fs";
import path from "path";

// Next.js harus matiin bodyParser untuk form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  form.parse(req, async (err: any, _fields: Fields, files: Files) => {
    try {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(400).json({ error: "Failed to parse form" });
      }

      const raw = (files.file as File | File[] | undefined);
      const f: File | undefined = Array.isArray(raw) ? raw[0] : raw;
      if (!f) return res.status(400).json({ error: "No file uploaded" });

      // file sudah berada di uploadDir karena pakai uploadDir + keepExtensions
      const fileName = path.basename(f.filepath);
      const relUrl = `/uploads/${fileName}`;

      const size = (() => {
        try { return fs.statSync(f.filepath).size; } catch { return f.size || 0; }
      })();

      const upload = await prisma.upload.create({
        data: {
          filename: fileName,
          url: relUrl,
          size: Number(size || 0),
          mimetype: (f.mimetype as string) || "application/octet-stream",
        },
      });

      return res.status(200).json(upload);
    } catch (e) {
      console.error("Upload handler error:", e);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
