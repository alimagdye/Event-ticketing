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
    },

    DEFAULT_RELATIONS: {
        venue: true,
        ticketTypes: true,
        eventSessions: true,
    },

    ALLOWED_RELATIONS: ['venue', 'category', 'organizer', 'eventSessions', 'ticketTypes'],

    MAX_LIMIT: 100,

    // CREATE EVENT
    async create(
        organizerId,
        { title, description, type, mode, banner, venueId, categoryId },
        tx = prismaClient,
        { selections, relations, exclude } = {}
    ) {
        const slug = eventService.generateSlug({ title });

        const existingEvent = await eventService.exists(organizerId, slug);
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

        const existingEvent = await eventService.findBySlug(organizerId, slug);
        if (existingEvent) {
            throw new ConflictError('Event with the same title already exists');
        }

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

        return tx.eventSession.createManyAndReturn({
            data: sessionsData,
        });
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

    async exists(organizerId, slug) {
        return prismaClient.event.findFirst({
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
    async validateAndFetchTickets(id, requestedTickets) {
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
            },
        });

        if (!event) throw new NotFoundError('Event not found');

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
            await eventService.validateAndFetchTickets(id, tickets);

        if (event.organizer.userId === userId) {
            throw new ConflictError('Organizers cannot purchase tickets for their own events');
        }

        const { order, session } = await prismaClient.$transaction(
            async (tx) => {
                const order = await orderService.create(
                    userId,
                    totalPrice,
                    itemsCount,
                    totalPrice === 0 ? OrderStatus.COMPLETED : OrderStatus.PENDING,
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
                    await ticketTypeService.issueTicketsForOrder(order, orderItems, userId, tx);
                } else {
                    session = await paymentService.createCheckoutSession(
                        undefined,
                        undefined,
                        lineItems,
                        userEmail,
                        {
                            orderId: order.id,
                            userId,
                        }
                    );
                }

                return { order, session };
            },
            { timeout: 2000 }
        );

        return {
            status: 'success',
            data: {
                orderId: order.id,
                stripeUrl: session?.url,
            },
        };
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
