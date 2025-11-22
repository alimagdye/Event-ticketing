import Redis from 'ioredis';
import { REDIS_URL } from './env.js';

const redis = new Redis(REDIS_URL, {
    enableReadyCheck: true,
    enableOfflineQueue: true,
});

async function connectRedis() {
    return new Promise((resolve, reject) => {
        redis.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        redis.on('ready', () => {
            console.log('✅ Redis is ready to accept commands');
            resolve(redis); // Now connectRedis resolves only when ready
        });

        redis.on('error', (err) => {
            console.error('❌ Redis connection error:', err.message);
            reject(err);
        });

        process.on('SIGINT', async () => {
            await redis.quit();
            console.log('Redis connection closed');
            process.exit(0);
        });
    });
}

export { connectRedis, redis };
