/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('MUSIC', 'SPORTS', 'THEATER', 'COMEDY', 'EDUCATION', 'TECHNOLOGY', 'HEALTH', 'BUSINESS', 'ART', 'TRAVEL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "City" AS ENUM ('CAIRO', 'ALEXANDRIA', 'GIZA', 'LUXOR', 'ASWAN', 'SHARM_EL_SHEIKH', 'HURGHADA', 'TANTA', 'MANSOURA', 'PORT_SAID', 'SUEZ', 'ISMAILIA', 'ZAGAZIG', 'DAMIETTA', 'FAYOUM', 'BENI_SUEF', 'QENA');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'FACEBOOK', 'APPLE', 'LOCAL');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'AR');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "Attendee" (
    "attendeeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "languagePreference" "Language" NOT NULL DEFAULT 'EN',
    "age" INTEGER,
    "gender" "Gender",
    "city" "City",
    "authProvider" "AuthProvider" NOT NULL,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("attendeeId")
);

-- CreateTable
CREATE TABLE "AttendeeCategory" (
    "attendeeCategoryId" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "AttendeeCategory_pkey" PRIMARY KEY ("attendeeCategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_email_key" ON "Attendee"("email");

-- AddForeignKey
ALTER TABLE "AttendeeCategory" ADD CONSTRAINT "AttendeeCategory_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("attendeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
