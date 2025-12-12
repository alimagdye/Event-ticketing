import { sendSuccess } from '../utils/response.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import paymentService from '../services/paymentService.js';

const paymentController = {
    handleWebhook: asyncWrapper(async (req, res) => {
        const signature = req.headers['stripe-signature'];

        const result = await paymentService.handleWebhookEvent(signature, req.body);

        return sendSuccess(res, { message: 'Webhook handled successfully', data: result }, 200);
    }),
};

export default paymentController;
