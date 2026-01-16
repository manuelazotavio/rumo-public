-- CreateEnum
CREATE TYPE "GuiaPlan" AS ENUM ('FREE', 'PREMIUM');

-- AlterTable
ALTER TABLE "guia" ADD COLUMN     "plan" "GuiaPlan" NOT NULL DEFAULT 'FREE';
