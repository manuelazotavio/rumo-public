/*
  Warnings:

  - You are about to drop the column `admin` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[certificate]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "admin",
ADD COLUMN     "admin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "certificate" VARCHAR(100),
ADD COLUMN     "guia" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "guiaId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "level" VARCHAR(20) NOT NULL DEFAULT 'INFO',
    "action" VARCHAR(100) NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "metadata" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "userId" INTEGER,
    "atracaoId" INTEGER,
    "guiaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visualizacaoPagina" (
    "id" SERIAL NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(500),
    "tempoGasto" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "viewerId" INTEGER,
    "atracaoId" INTEGER,
    "guiaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visualizacaoPagina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_userId_idx" ON "logs"("userId");

-- CreateIndex
CREATE INDEX "logs_action_idx" ON "logs"("action");

-- CreateIndex
CREATE INDEX "logs_createdAt_idx" ON "logs"("createdAt");

-- CreateIndex
CREATE INDEX "visualizacaoPagina_atracaoId_idx" ON "visualizacaoPagina"("atracaoId");

-- CreateIndex
CREATE INDEX "visualizacaoPagina_guiaId_idx" ON "visualizacaoPagina"("guiaId");

-- CreateIndex
CREATE INDEX "visualizacaoPagina_createdAt_idx" ON "visualizacaoPagina"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_certificate_key" ON "user"("certificate");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacaoPagina" ADD CONSTRAINT "visualizacaoPagina_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacaoPagina" ADD CONSTRAINT "visualizacaoPagina_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacaoPagina" ADD CONSTRAINT "visualizacaoPagina_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
