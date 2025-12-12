import express from 'express';
import { publicLimiter } from '../middlewares/rateLimiter.js';
import homeController from '../controllers/homeController.js';
import optionalAuth from '../middlewares/optionalAuth.js';

const Router = express.Router();

Router.get('/latest-events', publicLimiter, homeController.latestEvents);

Router.get('/new-events-this-week', publicLimiter, homeController.newEventsThisWeek);

Router.get('/categories', publicLimiter, homeController.allCategories);

Router.get('/past-events', publicLimiter, homeController.pastEventsAndHighlights);

Router.get('/nearby-events', publicLimiter, optionalAuth, homeController.nearbyEvents);

Router.get('/personalized-events', publicLimiter, optionalAuth, homeController.personalizedEvents);

export default Router;
