import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // Hapus cookie token
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  );

  return res.status(200).json({ success: true, message: "Logout berhasil" });
}
