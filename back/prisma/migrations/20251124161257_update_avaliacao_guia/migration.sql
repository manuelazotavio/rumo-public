-- AlterTable
ALTER TABLE "atracao" ADD COLUMN     "mediaNota" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAvaliacoes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "guia" ADD COLUMN     "mediaNota" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAvaliacoes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "atracaoId" INTEGER,
    "guiaId" INTEGER,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Avaliacao_atracaoId_idx" ON "Avaliacao"("atracaoId");

-- CreateIndex
CREATE INDEX "Avaliacao_guiaId_idx" ON "Avaliacao"("guiaId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_userId_atracaoId_key" ON "Avaliacao"("userId", "atracaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_userId_guiaId_key" ON "Avaliacao"("userId", "guiaId");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
