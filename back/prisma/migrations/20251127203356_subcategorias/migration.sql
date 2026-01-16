/*
  Warnings:

  - You are about to drop the column `slug` on the `categoria` table. All the data in the column will be lost.
  - You are about to drop the `Avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `atracaoCategoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_atracaoId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_guiaId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_userId_fkey";

-- DropForeignKey
ALTER TABLE "atracaoCategoria" DROP CONSTRAINT "atracaoCategoria_atracaoId_fkey";

-- DropForeignKey
ALTER TABLE "atracaoCategoria" DROP CONSTRAINT "atracaoCategoria_categoriaId_fkey";

-- DropIndex
DROP INDEX "categoria_slug_key";

-- AlterTable
ALTER TABLE "categoria" DROP COLUMN "slug";

-- DropTable
DROP TABLE "Avaliacao";

-- DropTable
DROP TABLE "atracaoCategoria";

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "atracaoId" INTEGER,
    "guiaId" INTEGER,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subCategoria" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "subCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atracaoSubCategoria" (
    "id" SERIAL NOT NULL,
    "atracaoId" INTEGER NOT NULL,
    "subCategoriaId" INTEGER NOT NULL,

    CONSTRAINT "atracaoSubCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "avaliacao_atracaoId_idx" ON "avaliacao"("atracaoId");

-- CreateIndex
CREATE INDEX "avaliacao_guiaId_idx" ON "avaliacao"("guiaId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_userId_atracaoId_key" ON "avaliacao"("userId", "atracaoId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_userId_guiaId_key" ON "avaliacao"("userId", "guiaId");

-- CreateIndex
CREATE INDEX "subCategoria_categoriaId_idx" ON "subCategoria"("categoriaId");

-- CreateIndex
CREATE INDEX "atracaoSubCategoria_subCategoriaId_idx" ON "atracaoSubCategoria"("subCategoriaId");

-- CreateIndex
CREATE INDEX "atracaoSubCategoria_atracaoId_idx" ON "atracaoSubCategoria"("atracaoId");

-- CreateIndex
CREATE UNIQUE INDEX "atracaoSubCategoria_atracaoId_subCategoriaId_key" ON "atracaoSubCategoria"("atracaoId", "subCategoriaId");

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subCategoria" ADD CONSTRAINT "subCategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atracaoSubCategoria" ADD CONSTRAINT "atracaoSubCategoria_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atracaoSubCategoria" ADD CONSTRAINT "atracaoSubCategoria_subCategoriaId_fkey" FOREIGN KEY ("subCategoriaId") REFERENCES "subCategoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
