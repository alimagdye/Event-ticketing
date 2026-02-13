-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "hasSeatMap" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "eventSeatId" INTEGER;

-- CreateTable
CREATE TABLE "EventSeatTier" (
    "id" SERIAL NOT NULL,
    "tierNumber" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "color" TEXT NOT NULL,
    "numberOfRows" INTEGER NOT NULL,
    "numberOfColumns" INTEGER NOT NULL,

    CONSTRAINT "EventSeatTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSeat" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "tierNumber" INTEGER NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "seatIndex" INTEGER NOT NULL,
    "isSold" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventSeat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSeatTier_eventId_tierNumber_key" ON "EventSeatTier"("eventId", "tierNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EventSeat_eventId_rowIndex_seatIndex_key" ON "EventSeat"("eventId", "rowIndex", "seatIndex");

-- AddForeignKey
ALTER TABLE "EventSeatTier" ADD CONSTRAINT "EventSeatTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSeat" ADD CONSTRAINT "EventSeat_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSeat" ADD CONSTRAINT "EventSeat_eventId_tierNumber_fkey" FOREIGN KEY ("eventId", "tierNumber") REFERENCES "EventSeatTier"("eventId", "tierNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventSeatId_fkey" FOREIGN KEY ("eventSeatId") REFERENCES "EventSeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
