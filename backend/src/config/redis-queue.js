import Redis from 'ioredis';
import { REDIS_URL } from './env.js';

const redisQueue = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redisQueue.on('connect', () => {
    console.log('✅ Redis Queue connected successfully');
});

redisQueue.on('error', (err) => {
    console.error('❌ Redis Queue connection error:', err.message);
});

process.on('SIGINT', async () => {
    await redisQueue.quit();
    console.log('Redis Queue connection closed');
});

export default redisQueue;

