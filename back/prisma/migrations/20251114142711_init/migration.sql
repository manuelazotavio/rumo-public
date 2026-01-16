-- CreateEnum
CREATE TYPE "AtracaoStatus" AS ENUM ('PENDENTE', 'ATIVO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "GuiaStatus" AS ENUM ('PENDENTE', 'ATIVO', 'REJEITADO');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "email" VARCHAR(250),
    "phone" VARCHAR(20),
    "admin" INTEGER NOT NULL DEFAULT 0,
    "pass" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guia" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "number" VARCHAR(30) NOT NULL DEFAULT 'S/N',
    "category" VARCHAR(100) NOT NULL,
    "segment" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "website" VARCHAR(100) NOT NULL,
    "certificate" VARCHAR(100),
    "languages" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "passHash" TEXT,
    "confirmationToken" TEXT,
    "status" "GuiaStatus" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "guia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atracao" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "slug" TEXT,
    "cpfcnpj" VARCHAR(20),
    "tipoatuacao" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(20) NOT NULL DEFAULT 'S/N',
    "description" VARCHAR(400),
    "email" VARCHAR(100),
    "multiLocation" BOOLEAN DEFAULT false,
    "website" VARCHAR(100),
    "address" VARCHAR(100),
    "number" VARCHAR(100),
    "cep" VARCHAR(20),
    "bairro" VARCHAR(100),
    "referencia" VARCHAR(300),
    "cadastur" VARCHAR(50),
    "preco" VARCHAR(10),
    "instagram" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" INTEGER,
    "rejectionReason" TEXT,
    "status" "AtracaoStatus" NOT NULL DEFAULT 'PENDENTE',
    "passHash" TEXT NOT NULL,
    "confirmationToken" TEXT,

    CONSTRAINT "atracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roteiro" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) DEFAULT 'Roteiro',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "secret" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "roteiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dia" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) DEFAULT 'Roteiro',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculaDia" (
    "id" SERIAL NOT NULL,
    "diaId" INTEGER NOT NULL,
    "atracaoId" INTEGER NOT NULL,

    CONSTRAINT "vinculaDia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculaRoteiro" (
    "id" SERIAL NOT NULL,
    "atracaoId" INTEGER NOT NULL,
    "roteiroId" INTEGER NOT NULL,

    CONSTRAINT "vinculaRoteiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagens" (
    "id" SERIAL NOT NULL,
    "atracaoId" INTEGER NOT NULL,
    "type" VARCHAR(500) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "ativo" TEXT DEFAULT 'A',

    CONSTRAINT "imagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atracaoCategoria" (
    "id" SERIAL NOT NULL,
    "atracaoId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "atracaoCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessionUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessionUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessionEmpresa" (
    "id" SERIAL NOT NULL,
    "atracaoId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessionEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_roteiroTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_roteiroToDia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "unique-email" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique-phone" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "guia_name_key" ON "guia"("name");

-- CreateIndex
CREATE UNIQUE INDEX "guia_email_key" ON "guia"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guia_confirmationToken_key" ON "guia"("confirmationToken");

-- CreateIndex
CREATE UNIQUE INDEX "atracao_slug_key" ON "atracao"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique-email-atracao" ON "atracao"("email");

-- CreateIndex
CREATE UNIQUE INDEX "atracao_confirmationToken_key" ON "atracao"("confirmationToken");

-- CreateIndex
CREATE INDEX "diaId" ON "vinculaDia"("diaId");

-- CreateIndex
CREATE INDEX "atracaoId" ON "vinculaDia"("atracaoId");

-- CreateIndex
CREATE INDEX "idx_atracaoRoteiro_roteiroId" ON "vinculaRoteiro"("roteiroId");

-- CreateIndex
CREATE UNIQUE INDEX "vinculaRoteiro_atracaoId_roteiroId_key" ON "vinculaRoteiro"("atracaoId", "roteiroId");

-- CreateIndex
CREATE INDEX "atracaoUserId" ON "imagens"("atracaoId");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_name_key" ON "categoria"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_slug_key" ON "categoria"("slug");

-- CreateIndex
CREATE INDEX "idx_atracaoCategoria_categoriaId" ON "atracaoCategoria"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "atracaoCategoria_atracaoId_categoriaId_key" ON "atracaoCategoria"("atracaoId", "categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "sessionUser_token_key" ON "sessionUser"("token");

-- CreateIndex
CREATE INDEX "sessionUserId" ON "sessionUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessionEmpresa_token_key" ON "sessionEmpresa"("token");

-- CreateIndex
CREATE INDEX "sessionAtracaoId" ON "sessionEmpresa"("atracaoId");

-- CreateIndex
CREATE UNIQUE INDEX "_roteiroTouser_AB_unique" ON "_roteiroTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_roteiroTouser_B_index" ON "_roteiroTouser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_roteiroToDia_AB_unique" ON "_roteiroToDia"("A", "B");

-- CreateIndex
CREATE INDEX "_roteiroToDia_B_index" ON "_roteiroToDia"("B");

-- AddForeignKey
ALTER TABLE "vinculaDia" ADD CONSTRAINT "vinculaDia_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaDia" ADD CONSTRAINT "vinculaDia_diaId_fkey" FOREIGN KEY ("diaId") REFERENCES "dia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaRoteiro" ADD CONSTRAINT "vinculaRoteiro_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaRoteiro" ADD CONSTRAINT "vinculaRoteiro_roteiroId_fkey" FOREIGN KEY ("roteiroId") REFERENCES "roteiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagens" ADD CONSTRAINT "imagens_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atracaoCategoria" ADD CONSTRAINT "atracaoCategoria_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atracaoCategoria" ADD CONSTRAINT "atracaoCategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessionUser" ADD CONSTRAINT "sessionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessionEmpresa" ADD CONSTRAINT "sessionEmpresa_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roteiroTouser" ADD CONSTRAINT "_roteiroTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "roteiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roteiroTouser" ADD CONSTRAINT "_roteiroTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roteiroToDia" ADD CONSTRAINT "_roteiroToDia_A_fkey" FOREIGN KEY ("A") REFERENCES "dia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roteiroToDia" ADD CONSTRAINT "_roteiroToDia_B_fkey" FOREIGN KEY ("B") REFERENCES "roteiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
