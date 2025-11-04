/*
  Warnings:

  - You are about to drop the `AttendeeCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('MUSIC', 'SPORTS', 'THEATER', 'COMEDY', 'EDUCATION', 'TECHNOLOGY', 'HEALTH', 'BUSINESS', 'ART', 'TRAVEL');

-- DropForeignKey
ALTER TABLE "public"."AttendeeCategory" DROP CONSTRAINT "AttendeeCategory_attendeeId_fkey";

-- DropTable
DROP TABLE "public"."AttendeeCategory";

-- DropEnum
DROP TYPE "public"."Category";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" "CategoryName" NOT NULL,

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
ALTER TABLE "AttendeeFavoriteCategory" ADD CONSTRAINT "AttendeeFavoriteCategory_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("attendeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeFavoriteCategory" ADD CONSTRAINT "AttendeeFavoriteCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
