/*
  Warnings:

  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `languagePreference` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
DROP COLUMN "languagePreference",
ADD COLUMN     "languagePreference" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Gender";

-- DropEnum
DROP TYPE "public"."Language";

-- DropEnum
DROP TYPE "public"."Role";
