/*
  Warnings:

  - Added the required column `type` to the `passeioImagem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passeioImagem" ADD COLUMN     "type" VARCHAR(500) NOT NULL;
