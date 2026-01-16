-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDENTE', 'ATIVO', 'REJEITADO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "description" VARCHAR(2000) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "location" VARCHAR(250),
    "links" JSONB,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDENTE',
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "atracaoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventImage" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,

    CONSTRAINT "eventImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "eventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_status_idx" ON "event"("status");

-- CreateIndex
CREATE INDEX "event_startDate_idx" ON "event"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "eventCategory_name_key" ON "eventCategory"("name");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "eventCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_atracaoId_fkey" FOREIGN KEY ("atracaoId") REFERENCES "atracao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventImage" ADD CONSTRAINT "eventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
