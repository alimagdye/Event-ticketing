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

        redis.on('ready', async () => {
            console.log('✅ Redis is ready to accept commands');

            try {
                // 🔥 Enable key expiration events
                await redis.config('SET', 'notify-keyspace-events', 'Ex');
                console.log('✅ Redis keyspace notifications enabled (Ex)');
            } catch (err) {
                console.error('❌ Failed to enable keyspace notifications:', err.message);
            }

            resolve(redis);
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
