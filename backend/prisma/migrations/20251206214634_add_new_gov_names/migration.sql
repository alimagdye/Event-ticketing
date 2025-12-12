/*
  Warnings:

  - Changed the type of `name` on the `Governorate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GovernorateName" AS ENUM ('ASWAN', 'LUXOR', 'ASYUT', 'RED_SEA', 'NEW_VALLEY', 'AL_MINYA', 'FAIYUM', 'CAIRO', 'SUEZ', 'NORTH_SINAI', 'PORT_SAID', 'AL_QALYUBIYA', 'SOUTH_SINAI', 'BANI_SWEIF', 'SUHAJ', 'QENA', 'AL_MINUFIYA', 'AL_ISMAILIYA', 'EASTERN', 'DAMIETTA', 'AD_DAKAHLIYA', 'GHARBIA', 'THE_LAKE', 'GIZA', 'MATRUH', 'ALEXANDRIA', 'KAFR_EL_SHEIKH');

-- AlterTable
ALTER TABLE "Governorate" DROP COLUMN "name",
ADD COLUMN     "name" "GovernorateName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Governorate_name_key" ON "Governorate"("name");
