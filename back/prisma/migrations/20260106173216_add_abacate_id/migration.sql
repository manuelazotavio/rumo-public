/*
  Warnings:

  - A unique constraint covering the columns `[abacateId]` on the table `transacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transacao" ADD COLUMN     "abacateId" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "transacao_abacateId_key" ON "transacao"("abacateId");
