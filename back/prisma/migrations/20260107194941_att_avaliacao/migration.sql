/*
  Warnings:

  - A unique constraint covering the columns `[userId,passeioId]` on the table `avaliacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,eventId]` on the table `avaliacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "avaliacao" ADD COLUMN     "eventId" INTEGER,
ADD COLUMN     "passeioId" INTEGER;

-- CreateIndex
CREATE INDEX "avaliacao_passeioId_idx" ON "avaliacao"("passeioId");

-- CreateIndex
CREATE INDEX "avaliacao_eventId_idx" ON "avaliacao"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_userId_passeioId_key" ON "avaliacao"("userId", "passeioId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_userId_eventId_key" ON "avaliacao"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_passeioId_fkey" FOREIGN KEY ("passeioId") REFERENCES "passeio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
