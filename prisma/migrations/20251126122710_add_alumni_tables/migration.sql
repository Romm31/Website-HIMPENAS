-- CreateTable
CREATE TABLE "AlumniYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumniYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "AlumniMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlumniYear_year_key" ON "AlumniYear"("year");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniYear_slug_key" ON "AlumniYear"("slug");

-- AddForeignKey
ALTER TABLE "AlumniMember" ADD CONSTRAINT "AlumniMember_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AlumniYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
