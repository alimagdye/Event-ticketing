/*
  Warnings:

  - You are about to drop the `GovernorateRelation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `governorateId` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."GovernorateRelation" DROP CONSTRAINT "GovernorateRelation_fromGovernorateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GovernorateRelation" DROP CONSTRAINT "GovernorateRelation_toGovernorateId_fkey";

-- AlterTable
ALTER TABLE "Governorate" ADD COLUMN     "otherGovsIdsSorted" JSONB;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "governorateId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."GovernorateRelation";

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "Governorate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
