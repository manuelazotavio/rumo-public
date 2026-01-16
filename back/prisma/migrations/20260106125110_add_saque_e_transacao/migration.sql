-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDITO', 'DEBITO', 'ESTORNO');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDENTE', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SaqueStatus" AS ENUM ('SOLICITADO', 'PROCESSANDO', 'PAGO', 'REJEITADO');

-- AlterTable
ALTER TABLE "guia" ADD COLUMN     "chavePix" VARCHAR(100),
ADD COLUMN     "saldoDisponivel" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "saldoPendente" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "transacao" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" VARCHAR(250) NOT NULL,
    "tipo" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDENTE',
    "clienteId" INTEGER,
    "passeioId" INTEGER,
    "liberadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saque" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" "SaqueStatus" NOT NULL DEFAULT 'SOLICITADO',
    "chavePix" VARCHAR(100) NOT NULL,
    "comprovante" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transacao_guiaId_idx" ON "transacao"("guiaId");

-- CreateIndex
CREATE INDEX "transacao_status_idx" ON "transacao"("status");

-- CreateIndex
CREATE INDEX "saque_guiaId_idx" ON "saque"("guiaId");

-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saque" ADD CONSTRAINT "saque_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
