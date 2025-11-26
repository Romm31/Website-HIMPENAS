/*
  Warnings:

  - You are about to drop the column `batch` on the `AlumniMember` table. All the data in the column will be lost.
  - You are about to drop the column `batchYear` on the `AlumniMember` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `AlumniMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlumniMember" DROP COLUMN "batch",
DROP COLUMN "batchYear",
DROP COLUMN "program";

-- AlterTable
ALTER TABLE "AlumniYear" ADD COLUMN     "batch" TEXT,
ADD COLUMN     "batchYear" INTEGER,
ADD COLUMN     "program" TEXT;
