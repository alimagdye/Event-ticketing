import sanitize from 'sanitize-html';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendFail, sendError } from '../utils/response.js';
import {
    HOSTNAME,
    NEWSLETTER_JWT_EXPIRY,
    NEWSLETTER_JWT_KEY,
    PORT,
    NEWSLETTER_CONFIRMATION_SUCCESS_URL,
    NEWSLETTER_CONFIRMATION_FAILURE_URL,
    NEWSLETTER_CONFIRMATION_ALREADY_SUBSCRIBED_URL,
} from '../config/env.js';
import mailService from '../services/mailService.js';
import { prisma } from '../config/db.js';


class NewsletterController {
    

    subscribe = async (req, res) => {
        try {
            const email = sanitize(req.body.email);
            const language = sanitize(req.body.language || 'en');
            if (!email) {
                return sendFail(res, 'Email is required!');
            }
            const token = this.signSubscriptionToken(email, language);
            const confirmationUrl = `http://${HOSTNAME}:${PORT}/api/v1/newsletter/confirm/${token}`;
            await mailService.sendNewsletterConfirmationJob(confirmationUrl, email, language);
            return sendSuccess(res, 'Confirmation email sent!');
        } catch (error) {
            return sendError(res, 'An error occurred while processing your request.');
        }
    };

    addSubscriberIfNotExists = async (email, language) => {
        let newsletterSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (newsletterSubscriber) return true;
        else
            newsletterSubscriber = await prisma.newsletterSubscriber.create({
                data: {
                    email,
                    languagePreference: language,
                },
            });

        return false;
    };

    signSubscriptionToken = (email, language) => {
        const payload = { email, language };
        const token = jwt.sign(payload, NEWSLETTER_JWT_KEY, {
            expiresIn: NEWSLETTER_JWT_EXPIRY,
        });
        return token;
    };

    confirmSubscription = async (req, res) => {
        try {
            const token = req.params.token;

            if (!token) {
                return res.redirect(NEWSLETTER_CONFIRMATION_FAILURE_URL);
            }

            const { email, language } = jwt.verify(token, NEWSLETTER_JWT_KEY);

            if (!email) {
                return res.redirect(NEWSLETTER_CONFIRMATION_FAILURE_URL);
            }

            const alreadySubscribed = await this.addSubscriberIfNotExists(email, language);

            if (alreadySubscribed) {
                return res.redirect(NEWSLETTER_CONFIRMATION_ALREADY_SUBSCRIBED_URL);
            }

            return res.redirect(NEWSLETTER_CONFIRMATION_SUCCESS_URL);
        } catch (err) {
            return res.redirect(NEWSLETTER_CONFIRMATION_FAILURE_URL);
        }
    };
}

export const newsletterController = new NewsletterController();
