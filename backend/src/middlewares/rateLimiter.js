import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis as redisClient } from '../config/redis.js';
import { sendError } from './../utils/response.js';
import { NODE_ENV } from '../config/env.js';

/**
 * Generic rate limiter factory
 *
 * @param {Object} options - Configuration options for the rate limiter
 * @param {number} options.windowMs - Time frame for which requests are checked/remembered (in milliseconds)
 * @param {number} options.max - Maximum number of connections allowed during the windowMs time frame
 * @param {string} [options.message] - Custom message to send when rate limit is exceeded
 * @param {string} [options.prefix] - Prefix for Redis keys to differentiate environments or use cases
 * @param {function} [options.keyGenerator] - Function to generate unique keys for each request
 * @returns {function} - Express middleware function for rate limiting
 *
 * @example
 * // Create a rate limiter that allows 100 requests per 15 minutes
 * const apiLimiter = rateLimiter({
 *     windowMs: 15 * 60 * 1000, // 15 minutes
 *     max: 100,
 *     message: 'Too many requests from this IP, please try again later.'
 * });
 *
 */
function rateLimiter({
    windowMs,
    max,
    message,
    prefix = 'global',
    keyGenerator = (req) => {
        const ipResult = ipKeyGenerator(req);
        return typeof ipResult === 'string' ? ipResult : (ipResult.ip ?? 'unknown');
    },
}) {
    return rateLimit({
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
            prefix: `rl:${NODE_ENV === 'production' ? '' : 'dev:'}${prefix}`,
        }),
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: keyGenerator,
        handler: (req, res) => {
            return sendError(
                res,
                message || 'Too many requests, please try again later.',
                'RATE_LIMIT_EXCEEDED',
                null,
                429
            );
        },
        skipFailedRequests: false,
        skipSuccessfulRequests: false,
    });
}

const strictLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many attempts. Please try again after 15 minutes.',
});

const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many authentication attempts. Please try again later.',
    prefix: 'auth',
});

const statusLimiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // allow up to 30 status checks per minute
    message: 'Too many status requests. Please slow down.',
});

const onboardingWriteLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // allow 10 write requests per 5 minutes
    message: 'Too many onboarding submissions. Please try again later.',
});

/**
 * Standard API rate limiter
 * 100 requests per 15 minutes
 * Use for: General API endpoints
 */
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests. Please slow down.',
});

/**
 * Heavy operation rate limiter
 * 20 requests per hour
 * Use for: File uploads, Reports generation
 */
const heavyLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: 'Too many heavy operations. Please try again later.',
});

/**
 * Email/OTP rate limiter
 * 3 requests per 5 minutes
 * Use for: Sending emails, OTP requests
 */
const emailLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3,
    message: 'Too many email requests. Please wait before requesting again.',
    prefix: 'email',
});

/**
 * Generous rate limiter for public endpoints
 * 300 requests per 15 minutes
 * Use for: Public data, Search, Browse events
 */
const publicLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    message: 'Request limit exceeded. Please try again shortly.',
});

const refreshLimiter = rateLimiter({
    windowMs: 30 * 60 * 1000, // 30min
    max: 60,
    message: 'Too many refresh attempts, Try again later.',
    prefix: 'refresh',
});

const requestResetLimiter = rateLimiter({
    windowMs: 30 * 60 * 1000, // 30min
    max: 5,
    message: 'Too many request reset password, Try again later.',
    prefix: 'reset',
});

const paymentLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: 'Too many payment attempts. Please try again later.',
    prefix: 'payment',
});

export {
    rateLimiter,
    strictLimiter,
    authLimiter,
    statusLimiter,
    onboardingWriteLimiter,
    apiLimiter,
    heavyLimiter,
    emailLimiter,
    publicLimiter,
    refreshLimiter,
    requestResetLimiter,
    paymentLimiter,
};
