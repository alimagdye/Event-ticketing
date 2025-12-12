import Stripe from 'stripe';
import {
    STRIPE_SECRET_KEY,
    SUCCESS_URL,
    CANCEL_URL,
    APP_CURRENCY,
    STRIPE_WEBHOOK_SECRET,
} from '../config/env.js';

import { prisma as prismaClient } from '../config/db.js';
import AppError from '../errors/AppError.js';
import ticketTypeService from './ticketTypeService.js';
import orderService from './orderService.js';
import OrderStatus from '../constants/enums/orderStatus.js';

const paymentService = {
    stripe: new Stripe(STRIPE_SECRET_KEY),

    // CREATE CHECKOUT SESSION
    async createCheckoutSession(
        paymentMethods = ['card'],
        mode = 'payment',
        lineItems,
        customerEmail,
        metadata = {},
        currency = APP_CURRENCY
    ) {
        return paymentService.stripe.checkout.sessions.create({
            payment_method_types: paymentMethods,
            mode: mode,
            line_items: lineItems,
            success_url: SUCCESS_URL,
            cancel_url: CANCEL_URL,
            customer_email: customerEmail,
            metadata: metadata,
            currency: currency,
        });
    },

    async retrieveSession(sessionId) {
        return paymentService.stripe.checkout.sessions.retrieve(sessionId);
    },

    async retrievePaymentIntent(paymentIntentId) {
        return paymentService.stripe.paymentIntents.retrieve(paymentIntentId);
    },

    async createPaymentIntent(amount, currency, metadata = {}) {
        return paymentService.stripe.paymentIntents.create({
            amount,
            currency,
            metadata,
        });
    },

    // WEBHOOK HANDLER
    async handleWebhookEvent(signature, rawBody) {
        let event;

        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            throw new AppError(`Signature verification failed: ${err.message}`);
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await paymentService.handleCheckoutCompleted(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await paymentService.handlePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    },

    // COMPLETED CHECKOUT HANDLER
    async handleCheckoutCompleted(session) {
        const orderId = session.metadata.orderId;
        const userId = session.metadata.userId;

        await prismaClient.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true },
            });

            if (!order || order.status === OrderStatus.COMPLETED) return;

            await ticketTypeService.issueTicketsForOrder(orderId, userId, order.orderItems, tx);

            await orderService.updateOrderStatus(orderId, OrderStatus.COMPLETED, tx);
        });
    },

    // CANCELED CHECKOUT HANDLER
    async handlePaymentFailed(session) {
        const orderId = session.metadata.orderId;
        await orderService.updateOrderStatus(orderId, OrderStatus.CANCELED);
    },
};

export default paymentService;
