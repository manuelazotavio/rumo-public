-- CreateTable
CREATE TABLE "vinculaGuiaRoteiro" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "roteiroId" INTEGER NOT NULL,

    CONSTRAINT "vinculaGuiaRoteiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guiaImagem" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,

    CONSTRAINT "guiaImagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoriaGuia" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT,

    CONSTRAINT "categoriaGuia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guiaCategoria" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "guiaCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vinculaGuiaRoteiro_roteiroId_idx" ON "vinculaGuiaRoteiro"("roteiroId");

-- CreateIndex
CREATE UNIQUE INDEX "vinculaGuiaRoteiro_guiaId_roteiroId_key" ON "vinculaGuiaRoteiro"("guiaId", "roteiroId");

-- CreateIndex
CREATE INDEX "guiaImagem_guiaId_idx" ON "guiaImagem"("guiaId");

-- CreateIndex
CREATE UNIQUE INDEX "categoriaGuia_name_key" ON "categoriaGuia"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categoriaGuia_slug_key" ON "categoriaGuia"("slug");

-- CreateIndex
CREATE INDEX "guiaCategoria_categoriaId_idx" ON "guiaCategoria"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "guiaCategoria_guiaId_categoriaId_key" ON "guiaCategoria"("guiaId", "categoriaId");

-- AddForeignKey
ALTER TABLE "vinculaGuiaRoteiro" ADD CONSTRAINT "vinculaGuiaRoteiro_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaGuiaRoteiro" ADD CONSTRAINT "vinculaGuiaRoteiro_roteiroId_fkey" FOREIGN KEY ("roteiroId") REFERENCES "roteiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guiaImagem" ADD CONSTRAINT "guiaImagem_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guiaCategoria" ADD CONSTRAINT "guiaCategoria_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guiaCategoria" ADD CONSTRAINT "guiaCategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoriaGuia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
