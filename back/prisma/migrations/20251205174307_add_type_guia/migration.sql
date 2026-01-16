/*
  Warnings:

  - Added the required column `type` to the `guiaImagem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guiaImagem" ADD COLUMN     "type" VARCHAR(500) NOT NULL;
