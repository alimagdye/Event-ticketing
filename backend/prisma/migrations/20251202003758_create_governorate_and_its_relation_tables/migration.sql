-- CreateTable
CREATE TABLE "Governorate" (
    "id" SERIAL NOT NULL,
    "name" "GovernorateName" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Governorate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernorateRelation" (
    "fromGovernorateId" INTEGER NOT NULL,
    "toGovernorateId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GovernorateRelation_pkey" PRIMARY KEY ("fromGovernorateId","toGovernorateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Governorate_name_key" ON "Governorate"("name");

-- AddForeignKey
ALTER TABLE "GovernorateRelation" ADD CONSTRAINT "GovernorateRelation_fromGovernorateId_fkey" FOREIGN KEY ("fromGovernorateId") REFERENCES "Governorate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernorateRelation" ADD CONSTRAINT "GovernorateRelation_toGovernorateId_fkey" FOREIGN KEY ("toGovernorateId") REFERENCES "Governorate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
