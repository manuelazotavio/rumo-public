-- CreateTable
CREATE TABLE "vinculaRoteiroEvento" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "roteiroId" INTEGER NOT NULL,

    CONSTRAINT "vinculaRoteiroEvento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vinculaRoteiroEvento_roteiroId_idx" ON "vinculaRoteiroEvento"("roteiroId");

-- CreateIndex
CREATE UNIQUE INDEX "vinculaRoteiroEvento_eventId_roteiroId_key" ON "vinculaRoteiroEvento"("eventId", "roteiroId");

-- AddForeignKey
ALTER TABLE "vinculaRoteiroEvento" ADD CONSTRAINT "vinculaRoteiroEvento_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculaRoteiroEvento" ADD CONSTRAINT "vinculaRoteiroEvento_roteiroId_fkey" FOREIGN KEY ("roteiroId") REFERENCES "roteiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
