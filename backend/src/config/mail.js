import nodemailer from 'nodemailer';
import { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } from './env.js';

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: false,
    ...(MAIL_USER && MAIL_PASS
        ? {
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS,
            },
        }
        : {}),
});

export default transporter;
