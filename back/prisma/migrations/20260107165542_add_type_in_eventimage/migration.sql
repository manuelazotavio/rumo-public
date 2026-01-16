/*
  Warnings:

  - Added the required column `type` to the `eventImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eventImage" ADD COLUMN     "type" VARCHAR(500) NOT NULL;
