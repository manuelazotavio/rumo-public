/*
  Warnings:

  - A unique constraint covering the columns `[certificate]` on the table `guia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guia_certificate_key" ON "guia"("certificate");
