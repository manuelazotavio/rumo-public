-- AlterTable
ALTER TABLE "guia" ADD COLUMN     "description" VARCHAR(400);

-- CreateTable
CREATE TABLE "vinculaAtracaoPasseio" (
    "id" SERIAL NOT NULL,
    "atracaoId" INTEGER NOT NULL,
    "passeioId" INTEGER NOT NULL,

    CONSTRAINT "vinculaAtracaoPasseio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculaRoteiroPasseio" (
    "id" SERIAL NOT NULL,
    "roteiroId" INTEGER NOT NULL,
    "passeioId" INTEGER NOT NULL,

    CONSTRAINT "vinculaRoteiroPasseio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passeio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(400),
    "price" VARCHAR(400),
    "duration" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passeio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passeioImagem" (
    "id" SERIAL NOT NULL,
    "passeioId" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,

    CONSTRAINT "passeioImagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculaGuiaPasseio" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "passeioId" INTEGER NOT NULL,

    CONSTRAINT "vinculaGuiaPasseio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vinculaAtracaoPasseio_passeioId_idx" ON "vinculaAtracaoPasseio"("passeioId");

-- CreateIndex
CREATE UNIQUE INDEX "vinculaAtracaoPasseio_atracaoId_passeioId_key" ON "vinculaAtracaoPasseio"("atracaoId", "passeioId");

-- CreateIndex
CREATE INDEX "vinculaRoteiroPasseio_passeioId_idx" ON "vinculaRoteiroPasseio"("passeioId");

-- CreateIndex
CREATE UNIQUE INDEX "vinculaRoteiroPasseio_roteiroId_passeioId_key" ON "vinculaRoteiroPasseio"("roteiroId", "passeioId");

-- CreateIndex
CREATE INDEX "passeioImagem_passeioId_idx" ON "passeioImagem"("passeioId");

-- CreateIndex
CREATE INDEX "vinculaGuiaPasseio_passeioId_idx" ON "vinculaGuiaPasseio"("passeioId");

-- CreateIndex
CREATE UNIQUE INDEX "vinculaGuiaPasseio_guiaId_passeioId_key" ON "vinculaGuiaPasseio"("guiaId", "passeioId");

-- AddForeignKey
ALTER TABLE "vinculaAtracaoPasseio" ADD CONSTRAINT "vinculaAtracaoPasseio_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaAtracaoPasseio" ADD CONSTRAINT "vinculaAtracaoPasseio_passeioId_fkey" FOREIGN KEY ("passeioId") REFERENCES "passeio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaRoteiroPasseio" ADD CONSTRAINT "vinculaRoteiroPasseio_roteiroId_fkey" FOREIGN KEY ("roteiroId") REFERENCES "roteiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaRoteiroPasseio" ADD CONSTRAINT "vinculaRoteiroPasseio_passeioId_fkey" FOREIGN KEY ("passeioId") REFERENCES "passeio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passeioImagem" ADD CONSTRAINT "passeioImagem_passeioId_fkey" FOREIGN KEY ("passeioId") REFERENCES "passeio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaGuiaPasseio" ADD CONSTRAINT "vinculaGuiaPasseio_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaGuiaPasseio" ADD CONSTRAINT "vinculaGuiaPasseio_passeioId_fkey" FOREIGN KEY ("passeioId") REFERENCES "passeio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
