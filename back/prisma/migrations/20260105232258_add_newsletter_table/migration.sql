-- AlterTable
ALTER TABLE "atracao" ADD COLUMN     "guiaId" INTEGER;

-- AddForeignKey
ALTER TABLE "atracao" ADD CONSTRAINT "atracao_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
