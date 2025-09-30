/*
  Warnings:

  - You are about to drop the column `misi` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `visi` on the `About` table. All the data in the column will be lost.
  - You are about to drop the `VisiMisi` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "About" DROP COLUMN "misi",
DROP COLUMN "visi";

-- DropTable
DROP TABLE "VisiMisi";

-- CreateTable
CREATE TABLE "Visi" (
    "id" SERIAL NOT NULL,
    "konten" TEXT NOT NULL,

    CONSTRAINT "Visi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Misi" (
    "id" SERIAL NOT NULL,
    "konten" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "Misi_pkey" PRIMARY KEY ("id")
);
