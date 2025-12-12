import express from 'express';
import paymentController from '../controllers/paymentController.js';

const Router = express.Router();

Router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default Router;
