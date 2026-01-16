-- AlterTable
ALTER TABLE "atracao" ADD COLUMN     "googlePlaceId" VARCHAR(100),
ADD COLUMN     "googleRating" DOUBLE PRECISION,
ADD COLUMN     "googleUserRatingsTotal" INTEGER,
ADD COLUMN     "lastGoogleUpdate" TIMESTAMP(3);
