import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin2@example.com";
  const password = "admin123";
  const name = "Administrator";

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
    },
  });

  console.log("✅ Akun berhasil dibuat:");
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error("❌ Gagal membuat user:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
