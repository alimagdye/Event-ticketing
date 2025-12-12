import express from 'express';
import { onboardingWriteLimiter, statusLimiter } from '../middlewares/rateLimiter.js';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import { onboardingController } from '../controllers/onboardingController.js';
import onboardingValidations from '../validations/onboardingValidation.js';

const Router = express.Router();

Router.get('/status', statusLimiter, auth, onboardingController.getStatus);

Router.patch(
    '/basic',
    onboardingWriteLimiter,
    auth,
    onboardingValidations.updateBasic,
    validate,
    onboardingController.updateBasic
);

Router.patch(
    '/preferences',
    onboardingWriteLimiter,
    auth,
    onboardingValidations.updatePreferences,
    validate,
    onboardingController.updatePreferences
);

Router.patch(
    '/location',
    onboardingWriteLimiter,
    auth,
    onboardingValidations.updateLocation,
    validate,
    onboardingController.updateLocation
);

export default Router;
