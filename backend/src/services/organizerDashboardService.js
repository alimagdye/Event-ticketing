import { prisma as prismaClient } from '../config/db.js';
import organizerService from './organizerService.js';

const organizerDashboardService = {
    
    // EVENT PIE CHART
    async getEventsData(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: {
                    message: 'Organizer not found',
                },
            };
        }
        const organizerId = organizer.id;

        const activeEvents = await prismaClient.event.count({
            where: {
                organizerId,
                eventSessions: {
                    some: {
                        status: 'active',
                    },
                },
            },
        });
        const cancelledEvents = await prismaClient.event.count({
            where: {
                organizerId,
                eventSessions: {
                    some: {
                        status: 'cancelled',
                    },
                },
            },
        });
        const upcomingEvents = await prismaClient.event.count({
            where: {
                organizerId,
                eventSessions: {
                    some: {
                        startDate: { gte: new Date() },
                    },
                },
            },
        });

        return {
            labels: ['Active Events', 'Cancelled Events', 'Upcoming Events'],
            data: [activeEvents || 0, cancelledEvents || 0, upcomingEvents || 0],
        };
    },

    // TICKET BAR CHART
    async getTicketsData(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: { message: 'Organizer not found' },
            };
        }

        const organizerId = organizer.id;

        const totalAgg = await prismaClient.ticketType.aggregate({
            _sum: { quantity: true },
            where: {
                event: { organizerId },
            },
        });

        const total = totalAgg._sum.quantity || 0;

        const soldAgg = await prismaClient.orderItem.aggregate({
            _sum: { quantity: true },
            where: {
                ticketType: {
                    event: { organizerId },
                },
                order: {
                    status: 'completed',
                },
            },
        });

        const sold = soldAgg._sum.quantity || 0;

        const remaining = total - sold;

        return {
            labels: ['Total Tickets', 'Sold Tickets', 'Remaining Tickets'],
            data: [total || 0, sold || 0, remaining || 0],
        };
    },

    // ORDER BAR CHART
    async getOrdersData(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: {
                    message: 'Organizer not found',
                },
            };
        }
        const organizerId = organizer.id;

        const [totalOrders, completedOrders, pendingOrders, cancelledOrders] = await Promise.all([
            prismaClient.order.count({
                where: {
                    orderItems: {
                        some: {
                            ticketType: {
                                event: {
                                    organizerId: organizerId,
                                },
                            },
                        },
                    },
                },
            }),
            prismaClient.order.count({
                where: {
                    status: 'completed',
                    orderItems: {
                        some: {
                            ticketType: {
                                event: {
                                    organizerId: organizerId,
                                },
                            },
                        },
                    },
                },
            }),
            prismaClient.order.count({
                where: {
                    status: 'pending',
                    orderItems: {
                        some: {
                            ticketType: {
                                event: {
                                    organizerId: organizerId,
                                },
                            },
                        },
                    },
                },
            }),
            prismaClient.order.count({
                where: {
                    status: 'cancelled',
                    orderItems: {
                        some: {
                            ticketType: {
                                event: {
                                    organizerId: organizerId,
                                },
                            },
                        },
                    },
                },
            }),
        ]);

        return {
            labels: ['Total Orders', 'Completed Orders', 'Pending Orders', 'Cancelled Orders'],
            data: [
                totalOrders || 0,
                completedOrders || 0,
                pendingOrders || 0,
                cancelledOrders || 0,
            ],
        };
    },

    // EVENT STATS
    async getEventsStats(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: {
                    message: 'Organizer not found',
                },
            };
        }
        const organizerId = organizer.id;

        const totalEvents = await prismaClient.event.count({
            where: { organizerId },
        });

        const activeEvents = await prismaClient.event.count({
            where: {
                organizerId,
                eventSessions: {
                    some: {
                        status: 'active',
                    },
                },
            },
        });

        const upcomingEvents = await prismaClient.event.count({
            where: {
                organizerId,
                eventSessions: {
                    some: {
                        startDate: { gte: new Date() },
                    },
                },
            },
        });

        const endedEvents = await prismaClient.event.count({
            where: {
                organizerId,
                NOT: {
                    eventSessions: {
                        some: {
                            endDate: { gte: new Date() },
                        },
                    },
                },
            },
        });

        const cancelledEvents = await prismaClient.event.count({
            where: {
                organizerId,
                eventSessions: {
                    status: 'cancelled',
                },
            },
        });

        return {
            totalEvents: totalEvents || 0,
            activeEvents: activeEvents || 0,
            upcomingEvents: upcomingEvents || 0,
            endedEvents: endedEvents || 0,
            cancelledEvents: cancelledEvents || 0,
        };
    },

    // TICKETS STATS
    async getTicketStats(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: {
                    message: 'Organizer not found',
                },
            };
        }
        const organizerId = organizer.id;
        const [totalTickets, soldTickets] = await Promise.all([
            prismaClient.ticketType.aggregate({
                _sum: { quantity: true },
                where: {
                    event: {
                        organizerId: organizerId,
                    },
                },
            }),
            prismaClient.ticketType.aggregate({
                _sum: { sold: true },
                where: {
                    event: {
                        organizerId: organizerId,
                    },
                },
            }),
        ]);
        const total = totalTickets._sum.quantity || 0;
        const sold = soldTickets._sum.sold || 0;
        const remaining = totalTickets._sum.quantity - soldTickets._sum.sold;
        return {
            totalTickets: total || 0,
            soldTickets: sold || 0,
            remainingTickets: remaining || 0,
        };
    },

    // ORDER STATS
    async getOrderStats(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: {
                    message: 'Organizer not found',
                },
            };
        }
        const organizerId = organizer.id;
        const totalOrders = await prismaClient.order.count({
            where: {
                orderItems: {
                    some: {
                        ticketType: {
                            event: {
                                organizerId: organizerId,
                            },
                        },
                    },
                },
            },
        });

        const completedOrders = await prismaClient.order.count({
            where: {
                status: 'completed',
                orderItems: {
                    some: {
                        ticketType: {
                            event: {
                                organizerId: organizerId,
                            },
                        },
                    },
                },
            },
        });

        const pendingOrders = await prismaClient.order.count({
            where: {
                status: 'pending',
                orderItems: {
                    some: {
                        ticketType: {
                            event: {
                                organizerId: organizerId,
                            },
                        },
                    },
                },
            },
        });

        return {
            totalOrders: totalOrders || 0,
            completedOrders: completedOrders || 0,
            pendingOrders: pendingOrders || 0,
        };
    },

    // REVENUE STATS
    async getRevenueStats(userId) {
        const organizer = await organizerService.getByUserId(userId);
        if (!organizer) {
            return {
                status: 'fail',
                data: {
                    message: 'Organizer not found',
                },
            };
        }
        const organizerId = organizer.id;
        const totalRevenue = await prismaClient.order.aggregate({
            _sum: {
                totalPrice: true,
            },
            where: {
                orderItems: {
                    some: {
                        ticketType: {
                            event: {
                                organizerId: organizerId,
                            },
                        },
                    },
                },
            },
        });

        return {
            totalRevenue: totalRevenue._sum.totalPrice || 0,
        };
    },
};

export default organizerDashboardService;
