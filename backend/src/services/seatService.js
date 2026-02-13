import { PrismaClient } from '@prisma/client';

class SeatService {
    createEventSeatTiers = async (
        priceTiers,
        numberOfRows,
        numberOfColumns,
        eventId,
        tx = PrismaClient
    ) => {
        await tx.eventSeatTier.createMany({
            data: priceTiers.map((priceTier) => ({
                tierNumber: priceTier.id ? parseInt(priceTier.id) : 0,
                name: priceTier.name,
                price: parseFloat(priceTier.price),
                color: priceTier.color,
                numberOfRows: parseInt(numberOfRows),
                numberOfColumns: parseInt(numberOfColumns),
                eventId,
            })),
        });
    };

    createEventSeats = async (seatsData, eventId, tx = PrismaClient) => {
        await tx.eventSeat.createMany({
            data: seatsData.map((seat) => ({
                rowIndex: parseInt(seat.row),
                seatIndex: parseInt(seat.number),
                eventId,
                tierNumber: seat.tierId != null && seat.tierId !== '' ? parseInt(seat.tierId) : null,
            })),
        });
    };
}

const seatService = new SeatService();
export default seatService;
