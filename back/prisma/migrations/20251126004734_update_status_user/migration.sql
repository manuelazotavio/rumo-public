-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ATIVO', 'EXCLUIDO');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ATIVO';
