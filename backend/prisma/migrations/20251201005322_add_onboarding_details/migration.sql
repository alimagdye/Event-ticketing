/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'FACEBOOK', 'APPLE', 'LOCAL');

-- CreateEnum
CREATE TYPE "GovernorateName" AS ENUM ('CAIRO', 'GIZA', 'ALEXANDRIA', 'ASWAN', 'LUXOR', 'QALYUBIA', 'SHARQIA', 'GHARBIA', 'FAIYUM', 'BENI_SUEF', 'MINYA', 'ASSIUT', 'SOHAG', 'QENA', 'RED_SEA', 'SOUTH_SINAI', 'NORTH_SINAI', 'NEW_VALLEY', 'DAMIETTA', 'DAKAHLIA', 'PORT_SAID', 'SUEZ', 'ISMAILIA', 'MENOUFIA', 'KAFR_EL_SHEIKH', 'BEHEIRA', 'MATROUH');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "governorate" "GovernorateName",
ADD COLUMN     "idInProviderDB" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AttendeeFavoriteCategory" (
    "categoryId" INTEGER NOT NULL,
    "attendeeId" TEXT NOT NULL,

    CONSTRAINT "AttendeeFavoriteCategory_pkey" PRIMARY KEY ("attendeeId","categoryId")
);

-- AddForeignKey
ALTER TABLE "AttendeeFavoriteCategory" ADD CONSTRAINT "AttendeeFavoriteCategory_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeFavoriteCategory" ADD CONSTRAINT "AttendeeFavoriteCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
