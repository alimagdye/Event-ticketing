import { sendSuccess, sendFail } from '../utils/response.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import eventService from '../services/eventService.js';

const eventController = {
    show: asyncWrapper(async (req, res) => {
        const { id } = req.params;

        const result = await eventService.show(id);

        if (!result || result.status === 'fail') {
            return sendFail(res, result.data, result.statusCode || 400);
        }
        return sendSuccess(res, { event: result }, 200);
    }),

    availability: asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const result = await eventService.availability(id);

        if (!result || result.status === 'fail') {
            return sendFail(res, result.data, result.statusCode || 400);
        }
        return sendSuccess(res, { availability: result }, 200);
    }),

    checkout: asyncWrapper(async (req, res) => {
        const { id: userId, email: userEmail } = req.user;
        const { id } = req.params;
        const { tickets } = req.body;

        const result = await eventService.checkout(id, userId, userEmail, tickets);

        return sendSuccess(res, result.data, 201);
    }),

    reserve: asyncWrapper(async (req, res) => {
        const { id: userId } = req.user;
        const { id } = req.params;
        const { tickets } = req.body;

        const result = await eventService.reserve(id, userId, tickets, req.app.get('io'));

        if (!result || result.status === 'fail') {
            return sendFail(res, result.data, result.statusCode || 400);
        }
        return sendSuccess(res, result.data, 201);
    }),
};

export default eventController;
