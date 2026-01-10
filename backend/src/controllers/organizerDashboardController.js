import asyncWrapper from '../middlewares/asyncWrapper.js';
import { sendSuccess } from '../utils/response.js';
import organizerDashboardService from '../services/organizerDashboardService.js';

const organizerDashboardController = {
    getStats: asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const [eventStats, ticketStats, orderStats, revenueStats] = await Promise.all([
            organizerDashboardService.getEventsStats(userId),
            organizerDashboardService.getTicketStats(userId),
            organizerDashboardService.getOrderStats(userId),
            organizerDashboardService.getRevenueStats(userId),
        ]);
        return sendSuccess(
            res,
            {
                data: {
                    event: eventStats || {},
                    ticket: ticketStats || {},
                    order: orderStats || {},
                    revenue: revenueStats || {},
                },
            },
            200
        );
    }),

    getAnalytics: asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const [eventsData, ticketsData, ordersData] = await Promise.all([
            organizerDashboardService.getEventsData(userId),
            organizerDashboardService.getTicketsData(userId),
            organizerDashboardService.getOrdersData(userId),
        ]);
        return sendSuccess(
            res,
            {
                data: {
                    event: eventsData || {},
                    ticket: ticketsData || {},
                    order: ordersData || {},
                },
            },
            200
        );
    }),
};

export default organizerDashboardController;
