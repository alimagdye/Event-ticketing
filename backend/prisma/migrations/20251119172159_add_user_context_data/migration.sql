/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `languagePreference` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `authProvider` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ATTENDEE', 'ATTENDEEANDORGANIZER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'FACEBOOK', 'APPLE', 'LOCAL');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'AR');

-- CreateEnum
CREATE TYPE "GovernorateName" AS ENUM ('CAIRO', 'GIZA', 'ALEXANDRIA', 'ASWAN', 'LUXOR', 'QALYUBIA', 'SHARQIA', 'GHARBIA', 'FAIYUM', 'BENI_SUEF', 'MINYA', 'ASSIUT', 'SOHAG', 'QENA', 'RED_SEA', 'SOUTH_SINAI', 'NORTH_SINAI', 'NEW_VALLEY', 'DAMIETTA', 'DAKAHLIA', 'PORT_SAID', 'SUEZ', 'ISMAILIA', 'MENOUFIA', 'KAFR_EL_SHEIKH', 'BEHEIRA', 'MATROUH');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "location",
ADD COLUMN     "authProvider" "AuthProvider" NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "governorate" "GovernorateName",
ADD COLUMN     "idInProviderDB" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
DROP COLUMN "languagePreference",
ADD COLUMN     "languagePreference" "Language" NOT NULL DEFAULT 'EN';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendeeFavoriteCategory" (
    "attendeeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "AttendeeFavoriteCategory_pkey" PRIMARY KEY ("attendeeId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "AttendeeFavoriteCategory" ADD CONSTRAINT "AttendeeFavoriteCategory_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeFavoriteCategory" ADD CONSTRAINT "AttendeeFavoriteCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
