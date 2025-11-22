import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
const app = express();

//! BEFORE MIDDLEWARES
import { cors, corsOptions } from './config/cors.js';
import { activityLogger } from './middlewares/activityLogger.js';


//! ROUTES
import authRoutes from './routes/auth.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';

app.use(helmet());
app.use(cors(corsOptions));
app.use(activityLogger);
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/onboarding", onboardingRoutes);


export default app;
