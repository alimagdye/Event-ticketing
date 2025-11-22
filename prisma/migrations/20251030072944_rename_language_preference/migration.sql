/*
  Warnings:

  - You are about to drop the column `languagePerference` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'organizer';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "languagePerference",
ADD COLUMN     "languagePreference" "Language" NOT NULL DEFAULT 'en',
ALTER COLUMN "age" DROP NOT NULL;
