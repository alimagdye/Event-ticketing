import asyncWrapper from '../middlewares/asyncWrapper.js';
import { parsePagination } from '../utils/paginationHelpers.js';
import { sendSuccess } from '../utils/response.js';
import homeService from '../services/homeService.js';

const homeController = {
    latestEvents: asyncWrapper(async (req, res) => {
        const { page, limit } = parsePagination(req.query);

        const result = await homeService.latestEvents({ limit, page });

        return sendSuccess(res, { events: result });
    }),

    newEventsThisWeek: asyncWrapper(async (req, res) => {
        const { page, limit } = parsePagination(req.query);

        const result = await homeService.newEventsThisWeek({ limit, page });

        return sendSuccess(res, { events: result });
    }),

    allCategories: asyncWrapper(async (req, res) => {
        const { page, limit } = parsePagination(req.query);

        const result = await homeService.getCategories({ limit, page });
        return sendSuccess(res, { categories: result });
    }),

    pastEventsAndHighlights: asyncWrapper(async (req, res) => {
        const { page, limit } = parsePagination(req.query);

        const result = await homeService.pastEventsAndHighlights({ limit, page });

        return sendSuccess(res, { events: result });
    }),

    nearbyEvents: asyncWrapper(async (req, res) => {
        const { page, limit } = parsePagination(req.query);
        const userId = req.user.id;
        const result = await homeService.nearbyEvents({ userId, limit, page });

        return sendSuccess(res, { events: result });
    }),

    personalizedEvents: asyncWrapper(async (req, res) => {
        const { page, limit } = parsePagination(req.query);
        const userId = req.user.id;
        const result = await homeService.personalizedEvents({ userId, limit, page });

        return sendSuccess(res, { events: result });
    }),
};

export default homeController;
