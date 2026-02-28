import { prisma as prismaClient } from '../config/db.js';
import slugify from 'slugify';
import ConflictError from '../errors/ConflictError.js';
import { PrismaQueryBuilder } from '../utils/queryBulider.js';
import fileService from './fileService.js';
import venueService from './venueService.js';
import orderService from './orderService.js';
import NotFoundError from '../errors/NotFoundError.js';
import paymentService from './paymentService.js';
import OrderStatus from '../constants/enums/orderStatus.js';
import ticketTypeService from './ticketTypeService.js';
import { redis } from '../config/redis.js';

const eventService = {
    DEFAULT_MEDIA_FOLDER: 'events',

    DEFAULT_EXCLUDE_FIELDS: {
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        venueId: true,
    },

    DEFAULT_SELECTIONS: {
        id: true,
        organizerId: true,
        title: true,
        slug: true,
        description: true,
        type: true,
        mode: true,
        bannerDisk: true,
        bannerPath: true,
        venueId: true,
        eventSessions: true,
        categoryId: true,
        createdAt: true,
        hasSeatMap: true,
    },

    DEFAULT_RELATIONS: {
        venue: true,
        ticketTypes: true,
        eventSessions: true,
        eventSeatTier: true,
        eventSeat: true,
    },

    ALLOWED_RELATIONS: [
        'venue',
        'category',
        'organizer',
        'eventSessions',
        'ticketTypes',
        'eventSeatTier',
        'eventSeat',
    ],

    MAX_LIMIT: 100,
    RESERVATION_TTL_SECONDS: 10 * 60,

    // CREATE EVENT
    async create(
        organizerId,
        { title, description, type, mode, banner, venueId, categoryId, eventType },
        tx = prismaClient,
        { selections, relations, exclude } = {}
    ) {
        const slug = eventService.generateSlug({ title });

        const existingEvent = await eventService.exists(organizerId, slug, tx);
        if (existingEvent) {
            throw new ConflictError('Event with the same title already exists');
        }

        const {
            disk: bannerDisk,
            url: bannerPath,
            absUrl,
        } = await eventService.handleBanner(banner, slug);

        const query = new PrismaQueryBuilder({
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .omit(exclude || eventService.DEFAULT_EXCLUDE_FIELDS).value;
        const event = await tx.event.create({
            data: {
                organizerId,
                title,
                slug,
                description,
                bannerDisk,
                bannerPath,
                mode,
                type,
                venueId,
                categoryId,
                hasSeatMap: eventType === 'seatmap',
            },
            ...query,
        });

        if (relations?.ticketTypes) {
            event.ticketTypes.map(
                (ticketType) => (ticketType.price = parseFloat(ticketType.price))
            );
        }
        const { bannerDisk: _, bannerPath: __, ...eventData } = event;

        return {
            ...eventData,
            bannerUrl: absUrl,
        };
    },

    //DELETE EVENT
    async delete(eventId) {
        return prismaClient.event.delete({
            where: { id: Number(eventId) },
        });
    },

    //SOFT DELETE EVENT
    async softDelete(eventId) {
        return prismaClient.event.update({
            where: { id: Number(eventId) },
            data: { deletedAt: new Date() },
        });
    },

    //UPDATE EVENT
    async update(
        eventId,
        organizerId,
        { title, description, banner, mode, type, categoryId, venueId },
        tx = prismaClient
    ) {
        const slug = eventService.generateSlug({ title });

        // const existingEvent = await eventService.findBySlug(organizerId, slug);
        // if (existingEvent) {
        //     throw new ConflictError('Event with the same title already exists');
        // }

        let newBannerPath = null;
        let newBannerDisk = null;
        let newAbsUrl = null;
        if (banner) {
            const {
                disk: bannerDisk,
                url: bannerPath,
                absUrl,
            } = await eventService.handleBanner(banner);
            newBannerPath = bannerPath;
            newBannerDisk = bannerDisk;
            newAbsUrl = absUrl;
        }

        const updatedEvent = await tx.event.update({
            where: { id: eventId },
            data: {
                title,
                slug,
                description,
                mode,
                type,
                categoryId,
                venueId,
                ...(newBannerDisk && { bannerDisk: newBannerDisk }),
                ...(newBannerPath && { bannerPath: newBannerPath }),
            },
        });

        const { bannerDisk, bannerPath, ...updatedEventData } = updatedEvent;

        return {
            ...updatedEventData,
            bannerUrl: newAbsUrl || eventService.getBannerAbsUrl(updatedEvent)[0].bannerUrl,
        };
    },

    async deleteSessions(eventId, tx = prismaClient) {
        return tx.eventSession.deleteMany({
            where: { eventId },
        });
    },

    async createBulkSessions(eventId, sessions, tx = prismaClient) {
        const sessionsData = sessions.map((session) => ({
            eventId,
            startDate: session.startDate,
            endDate: session.endDate,
        }));
        const result = await tx.eventSession.createMany({
            data: sessionsData,
        });
        return result;
    },

    async handleBanner(banner, relPath = null) {
        if (!banner) return { disk: null, url: null, absUrl: null };

        const folder = relPath
            ? `${eventService.DEFAULT_MEDIA_FOLDER}/${relPath}`
            : eventService.DEFAULT_MEDIA_FOLDER;
        return await fileService.save(banner, folder);
    },

    async findBySlug(organizerId, slug, { selections, relations, filters, exclude } = {}) {
        const query = new PrismaQueryBuilder({
            maxLimit: eventService.MAX_LIMIT,
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .where(filters)
            .omit(exclude).value;

        const event = await prismaClient.event.findFirst({
            where: { organizerId, slug },
            ...query,
        });

        if (!event) {
            return null;
        }

        if (relations?.ticketTypes) {
            event.ticketTypes.map(
                (ticketType) => (ticketType.price = parseFloat(ticketType.price))
            );
        }

        return eventService.getBannerAbsUrl(event);
    },

    async getAll({ selections, relations, page, limit, orderBy, filters, exclude } = {}) {
        const query = new PrismaQueryBuilder({
            maxLimit: eventService.MAX_LIMIT,
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .paginate(page, limit)
            .sort(orderBy || { createdAt: 'desc' })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .omit(exclude || eventService.DEFAULT_EXCLUDE_FIELDS)
            .where(filters).value;

        const events = await prismaClient.event.findMany(query);

        if (relations?.ticketTypes) {
            events.map((event) => {
                event.ticketTypes.map((ticketType) => {
                    ticketType.price = parseFloat(ticketType.price);
                });
            });
        }
        if (relations?.eventSessions) {
            events.map((event) => {
                event.eventSessions.map((session) => {});
            });
        }
        return eventService.getBannerAbsUrl(events);
    },

    async getById(id, { selections, relations, filters, exclude } = {}) {
        const query = new PrismaQueryBuilder({
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .omit(exclude || eventService.DEFAULT_EXCLUDE_FIELDS)
            .where(filters).value;
        console.log(selections, relations, filters, exclude);

        const event = await prismaClient.event.findUnique({
            where: { id },
            ...query,
        });

        if (event) {
            const [eventWithBannerUrl] = eventService.getBannerAbsUrl(event);
            return eventWithBannerUrl;
        }
        return null;
    },

    async getLatest({ selections, relations, orderBy, filters, exclude, limit, page } = {}) {
        const query = new PrismaQueryBuilder({
            maxLimit: eventService.MAX_LIMIT,
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .paginate(page, limit || 5)
            .sort({ createdAt: orderBy || 'desc' })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .where(filters)
            .omit(exclude || eventService.DEFAULT_EXCLUDE_FIELDS).value;

        const events = await prismaClient.event.findMany(query);
        if (relations?.ticketTypes) {
            events.map((event) => {
                event.ticketTypes.map((ticketType) => {
                    ticketType.price = parseFloat(ticketType.price);
                });
            });
        }
        return eventService.getBannerAbsUrl(events);
    },

    async getBySessionBetween(
        startDate,
        endDate,
        { selections, relations, orderBy, filters, exclude, limit, page } = {}
    ) {
        const query = new PrismaQueryBuilder({
            maxLimit: eventService.MAX_LIMIT,
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .omit(exclude || eventService.DEFAULT_EXCLUDE_FIELDS)
            .paginate(page, limit)
            .where({
                eventSessions: {
                    some: {
                        startDate: { lte: new Date(endDate) },
                        endDate: { gte: new Date(startDate) },
                    },
                },
                ...filters,
            })
            .sort(orderBy).value;

        const events = await prismaClient.event.findMany(query);
        if (relations?.ticketTypes) {
            events.map((event) => {
                event.ticketTypes.map((ticketType) => {
                    ticketType.price = parseFloat(ticketType.price);
                });
            });
        }
        return eventService.getBannerAbsUrl(events);
    },

    async getCreatedBetween(
        startDate,
        endDate,
        { selections, relations, orderBy, filters, exclude, page, limit } = {}
    ) {
        const query = new PrismaQueryBuilder({
            maxLimit: eventService.MAX_LIMIT,
            allowedRelations: eventService.ALLOWED_RELATIONS,
        })
            .select(selections || eventService.DEFAULT_SELECTIONS)
            .include(relations || eventService.DEFAULT_RELATIONS)
            .omit(exclude || eventService.DEFAULT_EXCLUDE_FIELDS)
            .paginate(page, limit)
            .where({
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
                ...filters,
            })
            .sort(orderBy).value;

        const events = await prismaClient.event.findMany(query);
        if (relations?.ticketTypes) {
            events.map((event) => {
                event.ticketTypes.map((ticketType) => {
                    ticketType.price = parseFloat(ticketType.price);
                });
            });
        }
        return eventService.getBannerAbsUrl(events);
    },

    async exists(organizerId, slug, tx = prismaClient) {
        return tx.event.findFirst({
            where: {
                organizerId,
                slug,
            },
        });
    },

    getBannerAbsUrl(events) {
        if (!events) return null;
        if (events && !Array.isArray(events)) {
            events = [events];
        }
        return events.map((event) => {
            const { bannerDisk, bannerPath } = event;

            const absUrl = bannerPath ? fileService.getAbsUrl(bannerPath, bannerDisk) : null;

            const { bannerDisk: _, bannerPath: __, updatedAt: ___, ...eventData } = event;

            return {
                ...eventData,
                bannerUrl: absUrl,
            };
        });
    },

    generateSlug({ title }) {
        return slugify(title, { lower: true, strict: true });
    },

    async show(id) {
        const relations = {
            venue: {
                omit: venueService.DEFAULT_EXCLUDE_FIELDS,
            },
            ticketTypes: {
                omit: ticketTypeService.DEFAULT_EXCLUDE_FIELDS,
            },

            eventSessions: {
                omit: {
                    eventId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },

            eventSeatTier: {
                omit: {
                    id: true,
                    eventId: true,
                },
            },
            eventSeat: {
                omit: {
                    id: true,
                    eventId: true,
                },
            },
        };

        const event = await eventService.getById(id, { relations });
        if (!event) {
            return {
                status: 'fail',
                statusCode: 404,
                data: { message: 'Event not found' },
            };
        }
        return event;
    },

    async availability(eventId) {
        // first check if the event exists and has seat map,
        const event = await eventService.getById(eventId, {
            relations: {
                eventSeat: {
                    select: {
                        rowIndex: true,
                        seatIndex: true,
                        isSold: true,
                    },
                },
            },
        });

        if (!event) {
            return {
                status: 'fail',
                statusCode: 404,
                data: { message: 'Event not found' },
            };
        }

        if (!event.hasSeatMap) {
            return {
                status: 'fail',
                statusCode: 400,
                data: { message: 'Event does not support seat map' },
            };
        }
        // second get seats reserved from redis and modify seats from main DB to have reserved seats also
        const reservedSeats = await redis.keys(`reservation:event:${eventId}:seat:*`);
        const reservedSeatSet = new Set(reservedSeats.map((key) => key.split(':').slice(-1)[0]));
        const seats = event.eventSeat.map((seat) => {
            const key = `${seat.rowIndex}-${seat.seatIndex}`;
            if (seat.isSold) {
                return {
                    row: seat.rowIndex,
                    number: seat.seatIndex,
                    status: 'sold',
                };
            }
            if (reservedSeatSet.has(key)) {
                return {
                    row: seat.rowIndex,
                    number: seat.seatIndex,
                    status: 'reserved',
                };
            }
            return {
                row: seat.rowIndex,
                number: seat.seatIndex,
                status: 'available',
            };
        });
        return {
            eventId,
            seats,
        };
    },

    async findSessionById(sessionId, { selections, relations, filters, exclude } = {}) {
        const query = new PrismaQueryBuilder({
            maxLimit: eventService.MAX_LIMIT,
        })
            .select(selections)
            .include(relations)
            .omit(exclude)
            .where(filters).value;

        return prismaClient.eventSession.findUnique({
            where: { id: sessionId },
            ...query,
        });
    },

    async isOrganizer(id, userId) {
        const event = await this.getById(id, {
            relations: {
                organizer: {
                    select: { userId: true, id: true },
                },
            },
        });

        if (!event) throw new NotFoundError('Event not found');

        if (!event.organizer) return false;

        return event.organizer.userId === userId;
    },

    // VALDIATION AND FETCH TICKETS FOR CHECKOUT
    async validateAndFetchTickets(id, requestedTickets, userId) {
        const event = await eventService.getById(id, {
            relations: {
                ticketTypes: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        sold: true,
                        quantity: true,
                    },
                },
                organizer: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
                eventSeatTier: {
                    select: {
                        tierNumber: true,
                        price: true,
                        name: true,
                    },
                },
                eventSeat: {
                    select: {
                        rowIndex: true,
                        seatIndex: true,
                        tierNumber: true,
                    },
                },
            },
        });

        if (!event) throw new NotFoundError('Event not found');
        if (event.hasSeatMap) {
            const seatMap = new Map(
                event.eventSeat.map((seat) => [`${seat.rowIndex}-${seat.seatIndex}`, seat])
            );

            const tierMap = new Map(event.eventSeatTier.map((tier) => [tier.tierNumber, tier]));

            const verifiedItems = [];
            const lineItems = [];
            let totalPrice = 0;
            let itemsCount = 0;

            const usedSeats = new Set();

            for (const reqTicket of requestedTickets) {
                const { row, number, tierId, tierName } = reqTicket.seatInfo;

                const key = `${row}-${number}`;

                //  Prevent duplicate seat in same request
                if (usedSeats.has(key)) {
                    throw new ConflictError('Duplicate seat selection');
                }
                usedSeats.add(key);

                //  Check seat exists
                const dbSeat = seatMap.get(key);
                if (!dbSeat) {
                    throw new NotFoundError('Seat does not exist');
                }

                //  Check seat not sold
                if (dbSeat.isSold) {
                    throw new ConflictError('Seat already sold');
                }

                //  Check tier matches
                if (dbSeat.tierNumber !== Number(tierId)) {
                    throw new ConflictError('Seat tier mismatch');
                }

                //  Get tier price
                const dbTier = tierMap.get(Number(tierId));
                if (!dbTier) {
                    throw new NotFoundError('Tier not found');
                }

                // check seats reserved in redis by the same user
                const reservationKey = `reservation:event:${id}:seat:${key}`;
                const reservation = await redis.get(reservationKey);
                if (reservation) {
                    const reservationData = JSON.parse(reservation);
                    if (reservationData.userId !== userId) {
                        throw new ConflictError('Seat already reserved by another user');
                    }
                } else {
                    // if not reserved, throw error to force frontend to reserve it first before checkout
                    throw new ConflictError(
                        'Seat not reserved, please reserve the seat before checkout'
                    );
                }

                const price = parseFloat(dbTier.price);

                totalPrice += price;
                itemsCount += 1;

                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Row ${String.fromCharCode(65 + row)}, Seat ${number + 1}`,
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                });

                verifiedItems.push({
                    eventId: event.id,
                    rowIndex: row,
                    seatIndex: number,
                    tierNumber: Number(tierId),
                    price,
                    ticketTypeId: Number(
                        event.ticketTypes.find((tier) => tier.name === tierName)?.id
                    ),
                    name: tierName,
                    quantity: 1,
                });
            }

            return { event, verifiedItems, totalPrice, itemsCount, lineItems };
        }
        // else for general admission tickets
        const dbTicketMap = new Map(event.ticketTypes.map((t) => [t.name, t]));
        const verifiedItems = [];
        const lineItems = [];
        let totalPrice = 0;
        let itemsCount = 0;

        for (const reqTicket of requestedTickets) {
            const dbTicket = dbTicketMap.get(reqTicket.name);

            if (!dbTicket) throw new NotFoundError(`Ticket ${reqTicket.name} invalid`);

            if (dbTicket.quantity - dbTicket.sold < reqTicket.quantity) {
                throw new ConflictError(`Not enough stock for ${reqTicket.name}`);
            }

            if (reqTicket.quantity <= 0) {
                throw new ConflictError(`Invalid quantity for ${reqTicket.name}`);
            }

            totalPrice += parseFloat(dbTicket.price) * reqTicket.quantity;
            itemsCount += reqTicket.quantity;

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: dbTicket.name },
                    unit_amount: Math.round(parseFloat(dbTicket.price) * 100),
                },
                quantity: reqTicket.quantity,
            });

            verifiedItems.push({
                ticketTypeId: dbTicket.id,
                price: dbTicket.price,
                name: dbTicket.name,
                quantity: reqTicket.quantity,
            });
        }

        return { event, verifiedItems, totalPrice, itemsCount, lineItems };
    },

    // CHECKOUT PROCESS
    async checkout(id, userId, userEmail, tickets) {
        const { event, verifiedItems, totalPrice, itemsCount, lineItems } =
            await eventService.validateAndFetchTickets(id, tickets, userId);
        if (event.organizer.userId === userId) {
            throw new ConflictError('Organizers cannot purchase tickets for their own events');
        }

        const { order, session } = await prismaClient.$transaction(
            async (tx) => {
                const order = await orderService.create(
                    userId,
                    totalPrice,
                    itemsCount,
                    parseInt(totalPrice) === 0 ? OrderStatus.COMPLETED : OrderStatus.PENDING,
                    {
                        selections: {
                            id: true,
                        },
                        exclude: {
                            updatedAt: true,
                            userId: true,
                        },
                        relations: {},
                        filter: {},
                    },
                    tx
                );

                const orderItems = await orderService.createOrderItemsBulk(
                    order.id,
                    verifiedItems,
                    tx
                );
                let session;
                if (totalPrice === 0) {
                    await ticketTypeService.issueTicketsForOrder(order, userId, orderItems, tx);
                } else {
                    session = await paymentService.createCheckoutSession(
                        undefined,
                        undefined,
                        lineItems,
                        userEmail,
                        {
                            orderId: order.id,
                            userId,
                            seatMetaData: JSON.stringify(verifiedItems),
                        }
                    );
                }

                return { order, session };
            },
            {
                timeout: 15000, // 15 seconds
            }
        );

        return {
            status: 'success',
            data: {
                orderId: order.id,
                stripeUrl: session?.url,
            },
        };
    },

    async reserve(eventId, userId, tickets, io) {
        // first check if the event exists and has seat map,
        const event = await eventService.getById(eventId, {
            relations: {
                eventSeat: {
                    select: {
                        rowIndex: true,
                        seatIndex: true,
                        isSold: true,
                    },
                },
            },
        });

        if (!event) {
            return {
                status: 'fail',
                statusCode: 404,
                data: { message: 'Event not found' },
            };
        }

        if (!event.hasSeatMap) {
            return {
                status: 'fail',
                statusCode: 400,
                data: { message: 'Seat reservation is only supported for seat-map events' },
            };
        }

        // then validate the requested seats,
        // Build lookup object
        const seatMap = {};

        for (const seat of event.eventSeat) {
            const key = `${seat.rowIndex}-${seat.seatIndex}`;
            seatMap[key] = seat;
        }

        let seatsRequest = {};
        // Validate tickets
        for (const ticket of tickets) {
            const { row, number } = ticket.seatInfo;
            const key = `${row}-${number}`;
            if (seatsRequest[key]) {
                return {
                    status: 'fail',
                    statusCode: 409,
                    data: {
                        message: `Duplicate seat selection at row ${row} and number ${number}`,
                    },
                };
            }
            seatsRequest[key] = true;
            const dbSeat = seatMap[key];

            if (!dbSeat) {
                return {
                    status: 'fail',
                    statusCode: 404,
                    data: { message: `Seat at row ${row} and number ${number} does not exist` },
                };
            }

            if (dbSeat.isSold) {
                return {
                    status: 'fail',
                    statusCode: 409,
                    data: { message: `Seat at row ${row} and number ${number} is already sold` },
                };
            }
        }

        // then try to reserve them in redis with a TTL,
        let reservedSeatsKeys = [];
        try {
            for (const ticket of tickets) {
                const { row, number } = ticket.seatInfo;
                const key = `reservation:event:${eventId}:seat:${row}-${number}`;
                const value = JSON.stringify({
                    userId,
                });
                const status = await redis.set(
                    key,
                    value,
                    'EX',
                    eventService.RESERVATION_TTL_SECONDS,
                    'NX'
                );
                if (!status) {
                    throw new Error(`Seat is already reserved`);
                }
                io.to(`event-${eventId}`).emit('seat:update', {
                    row,
                    number,
                    status: 'reserved',
                });
                reservedSeatsKeys.push(key);
            }

            return {
                status: 'success',
                data: {},
            };
        } catch (error) {
            if (reservedSeatsKeys.length > 0) {
                await redis.del(...reservedSeatsKeys);
            }
            if (error.message === 'Seat is already reserved') {
                return {
                    status: 'fail',
                    statusCode: 409,
                    data: { message: error.message },
                };
            }
            return {
                status: 'fail',
                statusCode: 500,
                data: { message: 'Failed to reserve seats, please try again2' },
            };
        }
    },

    async getNearbyEvents({ userId = null, limit = 6, page = 1 } = {}) {
        let governorateId = null;

        if (userId) {
            const user = await prismaClient.user.findUnique({
                where: { id: userId },
                select: { governorateId: true },
            });

            governorateId = user?.governorateId;
        }

        if (!governorateId) {
            const cairo = await prismaClient.governorate.findUnique({
                where: { name: 'CAIRO' },
                select: { id: true },
            });
            governorateId = cairo.id;
        }

        const { otherGovsIdsSorted } = await prismaClient.governorate.findUnique({
            where: { id: governorateId },
            select: { otherGovsIdsSorted: true },
        });

        const offset = (page - 1) * limit;

        const rows = await prismaClient.$queryRawUnsafe(
            `
  SELECT json_build_object(
      'id', e.id,
      'organizerId', e."organizerId",
      'title', e.title,
      'slug', e.slug,
      'description', e.description,
      'type', e.type,
      'mode', e.mode,
      'venueId', e."venueId",
      'categoryId', e."categoryId",
      'createdAt', e."createdAt",

      'venue', to_jsonb(v),

      --  ticketTypes aggregated without duplication
      'ticketTypes', COALESCE(tt.ticket_types, '[]'::json),

      --  eventSessions aggregated without duplication
      'eventSessions', COALESCE(es.sessions, '[]'::json),

      --  keep these for getBannerAbsUrl()
      'bannerDisk', e."bannerDisk",
      'bannerPath', e."bannerPath"
  ) AS event
  FROM "Event" e
  JOIN "Venue" v ON v.id = e."venueId"

  --  aggregate ticket types
  LEFT JOIN LATERAL (
      SELECT json_agg(tt.*) AS ticket_types
      FROM "TicketType" tt
      WHERE tt."eventId" = e.id
  ) tt ON TRUE

  --  aggregate event sessions
  LEFT JOIN LATERAL (
      SELECT json_agg(es.*) AS sessions
      FROM "EventSession" es
      WHERE es."eventId" = e.id
  ) es ON TRUE

  WHERE v."governorateId" = ANY($1::int[])
  ORDER BY array_position($1::int[], v."governorateId")
  LIMIT $2 OFFSET $3;
  `,
            otherGovsIdsSorted,
            limit,
            offset
        );

        const events = rows.map((r) => r.event);

        events.forEach((event) =>
            event.ticketTypes?.forEach((ticket) => (ticket.price = parseFloat(ticket.price)))
        );

        return eventService.getBannerAbsUrl(events);
    },

    async getPersonalizedEvents({ userId = null, limit = 6, page = 1 } = {}) {
        if (!userId) {
            return eventService.getAll({ limit, page });
        }

        const favorite = await prismaClient.attendeeFavoriteCategory.findMany({
            where: { attendeeId: userId },
            select: { categoryId: true },
        });

        const categoryIds = favorite.map((fav) => fav.categoryId);

        const events = await prismaClient.event.findMany({
            where: {
                categoryId: { in: categoryIds },
                deletedAt: null,
            },
            include: {
                venue: {
                    select: {
                        id: true,
                        googlePlaceId: true,
                        latitude: true,
                        longitude: true,
                        name: true,
                        address: true,
                        country: true,
                        state: true,
                        city: true,
                        zipCode: true,
                        createdAt: true,
                        updatedAt: true,
                        governorateId: true,
                    },
                },
                organizer: true,
                category: true,
                ticketTypes: true,

                eventSessions: {
                    where: { status: 'active' },
                    orderBy: { startDate: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        events.forEach((event) => {
            event.ticketTypes?.forEach((t) => {
                t.price = parseFloat(t.price);
            });
        });

        return eventService.getBannerAbsUrl(events);
    },
};

export default eventService;

/*
give me script written in Arabic for a video I will record for a demo for the graduation project. the video will last 3 minutes. I must open the project Fa3liat and open it as a guest and show all events sections in the home page, then try the newsletter if I don't want to create an account. then try to create an account with OTP sent to email. then get to the onboarding and add personal data. then try to reset password. then try see the personalized events and location personalization events sections. then try to buy . then try to create another account using google OAuth 2.0. and do the onboarding. then try to use upgrade to organizer.
*/
