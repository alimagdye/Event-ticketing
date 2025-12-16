import express from 'express';
import { subscribeLimiter, confirmLimiter } from '../middlewares/rateLimiter.js';
import validate from '../middlewares/validate.js';
import { newsletterController } from '../controllers/newsletterController.js';
import newsletterValidations from '../validations/newsletterValidations.js';

const Router = express.Router();

Router.post(
    '/subscribe',
    subscribeLimiter,
    newsletterValidations.subscribe,
    validate,
    newsletterController.subscribe
);

Router.get(
    '/confirm/:token',
    confirmLimiter,
    newsletterValidations.confirm,
    validate,
    newsletterController.confirmSubscription
);

export default Router;
