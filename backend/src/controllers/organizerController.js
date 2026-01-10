import asyncWrapper from '../middlewares/asyncWrapper.js';
import { sendSuccess, sendFail } from '../utils/response.js';
import organizerService from '../services/organizerService.js';

const organizerController = {
    createEvent: asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const banner = req.file;

        let { title, categoryName, location, description, tickets, sessions, type, mode } =
            req.body;
        console.log(req.body)
        const result = await organizerService.createEvent(userId, {
            title,
            categoryName,
            location,
            description,
            banner,
            tickets,
            sessions,
            type,
            mode,
        });

        if (result.status === 'fail') {
            return sendFail(res, result.data, 400);
        }

        return sendSuccess(res, result.data, 201);
    }),

    deleteEvent: asyncWrapper(async (req, res) => {
        const eventId = parseInt(req.params.eventId, 10);
        const userId = req.user.id;

        const result = await organizerService.deleteEvent(userId, eventId);

        if (result.status === 'fail') {
            return sendFail(res, result.data, 400);
        }

        return sendSuccess(res, result.data, 200);
    }),

    updateEvent: asyncWrapper(async (req, res) => {
        const eventId = parseInt(req.params.eventId, 10);
        const userId = req.user.id;
        const banner = req.file;
        console.log(banner)

        const { title, categoryName, location, description, tickets, sessions, type, mode } =
            req.body;

        const result = await organizerService.updateEvent(userId, eventId, {
            title,
            categoryName,
            location,
            description,
            banner,
            tickets,
            sessions,
            type,
            mode,
        });

        if (result.status === 'fail') {
            return sendFail(res, result.data, 400);
        }

        return sendSuccess(res, result.data, 200);
    }),

    listEvents: asyncWrapper(async (req, res) => {
        const userId = req.user.id;

        const result = await organizerService.listEvents(userId);

        if (result.status === 'fail') {
            return sendFail(res, result.data, 400)
        }

        return sendSuccess(res, result.data, 200);
    }),
};

export default organizerController;
