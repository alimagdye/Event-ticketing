import express from 'express';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import { paymentLimiter, availabilityLimiter, reserveLimiter } from '../middlewares/rateLimiter.js';
import eventValidation from '../validations/eventValidation.js';
import eventController from '../controllers/eventController.js';

const Router = express.Router();

Router.get('/:id', eventValidation.show, validate, eventController.show);

Router.get(
    '/:id/availability',
    availabilityLimiter,
    eventValidation.show,
    validate,
    eventController.availability
);

Router.post(
    '/:id/checkout',
    paymentLimiter,
    auth,
    eventValidation.checkout,
    validate,
    eventController.checkout
);

Router.post(
    '/:id/reserve',
    auth,
    reserveLimiter,
    eventValidation.reserve,
    validate,
    eventController.reserve
);

export default Router;
