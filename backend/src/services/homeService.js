import eventService from './eventService.js';
import categoryService from './categoryService.js';

const homeService = {
    async latestEvents({ limit = 6, page = 1 } = {}) {
        return await eventService.getLatest({ limit, page });
    },

    async newEventsThisWeek({ limit = 6, page = 1 } = {}) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const relations = {
            venue: {
                omit: {
                    id: true,
                    updatedAt: true,
                    createdAt: true,
                },
            },
            ticketTypes: {
                omit: {
                    id: true,
                    eventId: true,
                    updatedAt: true,
                    createdAt: true,
                },
            },
        };

        return eventService.getCreatedBetween(oneWeekAgo, new Date(), {
            limit,
            page,
            relations,
        });
    },

    async getCategories({ limit = 6, page = 1 } = {}) {
        return categoryService.getAll({ limit, page });
    },

    async pastEventsAndHighlights({ limit = 6, page = 1 } = {}) {
        const orderBy = [
            {
                createdAt: 'desc',
            },
        ];

        const relations = {
            venue: {
                omit: {
                    id: true,
                    updatedAt: true,
                    createdAt: true,
                },
            },
            ticketTypes: {
                omit: {
                    id: true,
                    eventId: true,
                    updatedAt: true,
                    createdAt: true,
                },
            },
        };

        const selections = {
            id: true,
            title: true,
            slug: true,
            description: true,
            bannerPath: true,
            bannerDisk: true,
            organizerId: true,
        };
        const now = new Date();

        return eventService.getCreatedBetween(new Date('2000-01-01'), now, {
            relations,
            limit,
            page,
            orderBy,
            selections,
        });
    },

    async nearbyEvents({ userId = null, limit = 6, page = 1 } = {}) {
        return eventService.getNearbyEvents({ userId, limit, page });
    },

    async personalizedEvents({ userId = null, limit = 6, page = 1 } = {}) {
        return eventService.getPersonalizedEvents({ userId, limit, page });
    }
};

export default homeService;
