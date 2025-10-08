import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ message: "Upload failed", error: err });
    }

    // 🔧 Ambil file (baik versi baru maupun lama)
    const file: File | File[] | undefined = files.file as any;
    const selectedFile = Array.isArray(file) ? file[0] : file;

    if (!selectedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Path aman (handle versi baru dan lama)
    const filePath =
      (selectedFile as any).filepath ||
      (selectedFile as any).path ||
      selectedFile.toString();

    const fileName = path.basename(filePath);
    const publicPath = `/uploads/${fileName}`;

    return res.status(200).json({ url: publicPath });
  });
}
