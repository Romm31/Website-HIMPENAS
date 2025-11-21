import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ success: false, message: "Email atau password salah" });
  }

  const match = await compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "Email atau password salah" });
  }

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(SECRET));

  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=7200`
  );

  return res.status(200).json({ success: true, message: "Login berhasil" });
}
