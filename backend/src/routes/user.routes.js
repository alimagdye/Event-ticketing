import express from 'express';
import userController from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const Router = express.Router();

Router.patch('/upgrade-to-organizer', apiLimiter, auth, userController.upgradeToOrganizer);

export default Router;