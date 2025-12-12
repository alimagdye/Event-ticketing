import express from 'express';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import { publicLimiter } from '../middlewares/rateLimiter.js';
import orderValidation from '../validations/orderValidation.js';
import orderController from '../controllers/orderController.js';

const Router = express.Router();

Router.get(
    '/:id/status',
    publicLimiter,
    auth,
    orderValidation.status,
    validate,
    orderController.status
);

export default Router;
