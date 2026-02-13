import { parse } from 'dotenv';
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
        const governorate = await tx.governorate.findUnique({
            where: { name: state.replaceAll(' ', '_').toUpperCase() },
            select: { id: true },
        });

        const governorateId = governorate?.id;

        if (!governorateId) {
            return { message: 'Governorate not found' };
        }

        return await tx.venue.create({
            data: {
                name,
                address,
                city,
                country,
                zipCode,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
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
        const governorate = await tx.governorate.findUnique({
            where: { name: state.replaceAll(' ', '_').toUpperCase() },
            select: { id: true },
        });

        const governorateId = governorate?.id;

        if (!governorateId) {
            return  { message: 'Governorate not found' };
        }

        return await tx.venue.update({
            where: { id: venueId },
            data: {
                name,
                address,
                city,
                country,
                zipCode,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                googlePlaceId,
                state,
                governorateId,
            },
        });
    },

    async getVenues() {
        return await prismaClient.venue.findMany();
    },
};
export default venueService;
