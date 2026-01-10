import express from 'express';
import organizerDashboardController from '../controllers/organizerDashboardController.js';
import authorize from '../middlewares/authorize.js';
import auth from '../middlewares/auth.js';

const Router = express.Router();

// DASHBOARD
Router.get('/stats', auth, authorize.isOrganizer, organizerDashboardController.getStats);
Router.get('/analytics', auth, authorize.isOrganizer, organizerDashboardController.getAnalytics);

export default Router;
