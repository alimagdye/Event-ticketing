import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = path.join(__dirname, '/..', '..');

dotenv.config({
    path: BASE_PATH + '/.env',
    quiet: true,
});

export const APP_NAME = process.env.APP_NAME;
export const HOSTNAME = process.env.HOSTNAME;
export const JWT_KEY = process.env.JWT_KEY;
export const PORT = process.env.PORT || 8000;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CALLBACK_URL = process.env.CALLBACK_URL;
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;
export const MAIL_FROM = process.env.MAIL_FROM;
export const REDIS_URL = process.env.REDIS_URL || 'redis://';
export const JWT_REKEY = process.env.JWT_REKEY;
export const FRONT_URL = process.env.FRONT_URL;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
export const PROTOCOL = process.env.PROTOCOL || 'http';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const SUCCESS_URL = `${FRONT_URL}/${process.env.SUCCESS_ROUTE}`;
export const CANCEL_URL = `${FRONT_URL}/${process.env.CANCEL_ROUTE}`;
export const APP_CURRENCY = process.env.APP_CURRENCY || 'USD';

export { BASE_PATH };
