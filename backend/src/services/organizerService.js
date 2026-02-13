import { prisma as prismaClient } from '../config/db.js';
import eventService from './eventService.js';
import ticketTypeService from './ticketTypeService.js';
import venueService from './venueService.js';
import fileService from './fileService.js';
import EventType from '../constants/enums/eventType.js';
import categoryService from '../services/categoryService.js';
import seatService from './seatService.js';

const organizerService = {
    // CREATE
    async create(userId, { isApproved = false }, tx = prismaClient) {
        return tx.organizer.create({
            data: {
                userId,
                isApproved,
            },
        });
    },

    // CREATE EVENT
    async createEvent(
        userId,
        {
            title,
            categoryName,
            sessions,
            location,
            description,
            banner,
            tickets,
            type,
            mode,
            eventType,
            seatsData,
            numberOfRows,
            numberOfColumns,
            priceTiers,
        }
    ) {
        const [organizer, category] = await Promise.all([
            organizerService.getByUserId(userId),
            categoryService.getByCategory(categoryName),
        ]);
        if (!organizer) {
            return {
                status: 'fail',
                data: { error: 'Organizer profile not found' },
            };
        }

        if (!organizer.isApproved) {
            return {
                status: 'fail',
                data: { error: 'Organizer is not approved to create events' },
            };
        }

        if (!category) return { status: 'fail', data: { error: 'Invalid category' } };
        let result;
        try {
            const result = await prismaClient.$transaction(
                async (tx) => {
                    const venue = await venueService.create(location, tx);
                    if (venue.message) {
                        throw new Error(venue.message);
                    }
                    const event = await eventService.create(
                        organizer.id,
                        {
                            title,
                            description,
                            banner,
                            mode,
                            type,
                            venueId: venue.id,
                            categoryId: category.id,
                            eventType,
                        },
                        tx
                    );
                    const eventSessions = await eventService.createBulkSessions(
                        event.id,
                        sessions,
                        tx
                    );
                    let ticketTypes = [];
                    if (tickets && tickets.length > 0 && type === EventType.TICKETED) {
                        ticketTypes = await ticketTypeService.createBulkTickets(
                            event.id,
                            tickets,
                            tx
                        );
                    } else if (tickets && tickets.length > 0 && type === EventType.FREE) {
                        ticketTypes = await ticketTypeService.createFreeBulkTickets(
                            event.id,
                            tickets,
                            tx
                        );
                    }
                    if (eventType === 'seatmap') {
                        await seatService.createEventSeatTiers(
                            priceTiers,
                            numberOfRows,
                            numberOfColumns,
                            event.id,
                            tx
                        );
                        await seatService.createEventSeats(seatsData, event.id, tx);
                    }

                    return { event, ticketTypes, venue, eventSessions };
                },
                {
                    timeout: 50000, // 15 seconds
                }
            );
            return {
                status: 'success',
                data: result,
            };
        } catch (err) {
            console.log(err);
            if (result?.event.bannerPath) {
                await fileService.delete(result?.event.bannerPath);
            }
            throw err;
        }
    },

    //UPDATE EVENT
    async updateEvent(
        userId,
        eventId,
        { title, categoryName, description, banner, tickets, sessions, type, mode, location }
    ) {
        const [organizer, event, category] = await Promise.all([
            organizerService.getByUserId(userId),
            eventService.getById(eventId),
            categoryService.getByCategory(categoryName),
        ]);

        if (!organizer) {
            return { status: 'fail', data: { error: 'Organizer not found' } };
        }

        if (!event) {
            return { status: 'fail', data: { error: `Event doesn't exist` } };
        }

        if (event.organizerId !== organizer.id) {
            return { status: 'fail', data: { error: 'Unauthorized to update this event' } };
        }

        if (!category) return { status: 'fail', data: { error: 'Invalid category' } };

        let oldBannerPath = event.bannerPath;
        let result;
        try {
            result = await prismaClient.$transaction(
                async (tx) => {
                    let updatedVenueId = event.venueId;
                    if (location) {
                        const updatedVenue = await venueService.update(event.venueId, location, tx);
                        if (updatedVenue.message) {
                            return { status: 'fail', data: { error: updatedVenue.message } };
                        }

                        updatedVenueId = updatedVenue.id;
                    }

                    const updatedEvent = await eventService.update(
                        eventId,
                        organizer.id,
                        {
                            title,
                            description,
                            banner,
                            mode,
                            type,
                            categoryId: category.id,
                            venueId: updatedVenueId,
                        },
                        tx
                    );

                    if (sessions && sessions.length > 0) {
                        await eventService.deleteSessions(eventId, tx);
                        await eventService.createBulkSessions(updatedEvent.id, sessions, tx);
                    }

                    // if (tickets && tickets.length > 0) {
                    //     await ticketTypeService.deleteTickets(eventId, tx);

                    //     if (type === EventType.TICKETED) {
                    //         await ticketTypeService.createBulkTickets(eventId, tickets, tx);
                    //     } else if (type === EventType.FREE) {
                    //         await ticketTypeService.createFreeBulkTickets(eventId, tickets, tx);
                    //     }
                    // }

                    return { updatedEvent };
                },
                {
                    timeout: 15000, // 15 seconds
                }
            );

            if (banner && oldBannerPath) {
                await fileService
                    .delete(oldBannerPath)
                    .catch((e) => console.log('Old banner delete failed', e));
            }

            return {
                status: 'success',
                data: {
                    message: 'Event updated successfully',
                    event: result.updatedEvent,
                },
            };
        } catch (err) {
            if (result?.updatedEvent?.bannerPath) {
                await fileService
                    .delete(result.updatedEvent.bannerPath)
                    .catch((e) => console.log('Rollback banner delete failed', e));
            }
            throw err;
        }
    },

    //DELETE EVENT
    async deleteEvent(userId, eventId) {
        const [event, organizer] = await Promise.all([
            eventService.getById(eventId),
            organizerService.getByUserId(userId),
        ]);

        if (!event) {
            return {
                status: 'fail',
                data: { error: `Event doesn't exist` },
            };
        }

        if (!organizer) {
            return {
                status: 'fail',
                data: { error: 'Organizer profile not found' },
            };
        }

        if (!organizer.isApproved) {
            return {
                status: 'fail',
                data: { error: 'Organizer is not approved to delete events' },
            };
        }

        if (event.organizerId !== organizer.id) {
            return {
                status: 'fail',
                data: { error: 'Unauthorized to delete this event' },
            };
        }

        if (event.deletedAt) {
            return {
                status: 'fail',
                data: { error: 'Event already deleted' },
            };
        }

        // check if the event related to tickets -> can't delete else -> soft delete or hard delete

        let result;
        try {
            // result = await eventService.delete(eventId);
            result = await eventService.softDelete(eventId);
        } catch (err) {
            if (err.code === 'P2003') {
                return {
                    status: 'fail',
                    data: { error: `The event related to tickets can't be deleted` },
                };
            }
            throw err;
        }

        if (result?.bannerPath) {
            await fileService
                .delete(result.bannerPath)
                .catch((e) => console.log('Rollback banner delete failed', e));
        }

        return {
            status: 'success',
            data: {
                message: 'Event deleted successfully',
            },
        };
    },

    async getByUserId(userId) {
        return prismaClient.organizer.findUnique({
            where: { userId },
        });
    },

    // GET ALL EVENTS
    async listEvents(userId) {
        const organizer = await organizerService.getByUserId(userId);

        if (!organizer) {
            return {
                status: 'fail',
                data: { error: 'Organizer not found' },
            };
        }

        const organizerId = organizer.id;

        const events = await prismaClient.event.findMany({
            where: { organizerId },
            select: {
                id: true,
                organizerId: true,
                title: true,
                description: true,
                venueId: true,
                bannerDisk: true,
                bannerPath: true,
                venue: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const result = await eventService.getBannerAbsUrl(events);

        return {
            status: 'success',
            data: {
                result,
            },
        };
    },
};

export default organizerService;
