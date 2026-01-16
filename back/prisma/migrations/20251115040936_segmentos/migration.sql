-- CreateTable
CREATE TABLE "segmentoGuia" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT,

    CONSTRAINT "segmentoGuia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guiaSegmento" (
    "id" SERIAL NOT NULL,
    "guiaId" INTEGER NOT NULL,
    "segmentoId" INTEGER NOT NULL,

    CONSTRAINT "guiaSegmento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "segmentoGuia_name_key" ON "segmentoGuia"("name");

-- CreateIndex
CREATE UNIQUE INDEX "segmentoGuia_slug_key" ON "segmentoGuia"("slug");

-- CreateIndex
CREATE INDEX "guiaSegmento_segmentoId_idx" ON "guiaSegmento"("segmentoId");

-- CreateIndex
CREATE UNIQUE INDEX "guiaSegmento_guiaId_segmentoId_key" ON "guiaSegmento"("guiaId", "segmentoId");

-- AddForeignKey
ALTER TABLE "guiaSegmento" ADD CONSTRAINT "guiaSegmento_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guiaSegmento" ADD CONSTRAINT "guiaSegmento_segmentoId_fkey" FOREIGN KEY ("segmentoId") REFERENCES "segmentoGuia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
