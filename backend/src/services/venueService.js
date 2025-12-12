import { prisma as prismaClient } from '../config/db.js';

const venueService = {
    DEFAULT_EXCLUDE_FIELDS: {
        createdAt: true,
        updatedAt: true,
    },
    async create(
        {
            name,
            address,
            city,
            country,
            state,
            zipCode = null,
            longitude,
            latitude,
            googlePlaceId = null,
        },
        tx = prismaClient
    ) {
        const governorateId = await tx.governorate.findUnique({
            where: { name: state.replaceAll(' ', '_').toUpperCase() },
            select: { id: true },
        })?.id;

        if (!governorateId) {
            return sendFail(res, { message: 'Governorate not found' }, 404);
        }

        return tx.venue.create({
            data: {
                name,
                address,
                city,
                country,
                zipCode,
                longitude,
                latitude,
                googlePlaceId,
                state,
                governorateId,
            },
        });
    },

    async update(
        venueId,
        { name, address, city, country, zipCode, longitude, latitude, googlePlaceId, state },
        tx = prismaClient
    ) {
        const governorateId = await tx.governorate.findUnique({
            where: { name: state.replaceAll(' ', '_').toUpperCase() },
            select: { id: true },
        })?.id;

        if (!governorateId) {
            return sendFail(res, { message: 'Governorate not found' }, 404);
        }

        return tx.venue.update({
            where: { id: venueId },
            data: {
                name,
                address,
                city,
                country,
                zipCode,
                latitude,
                longitude,
                googlePlaceId,
                state,
                governorateId,
            },
        });
    },

    async getVenues() {
        return prismaClient.venue.findMany();
    },
};
export default venueService;
