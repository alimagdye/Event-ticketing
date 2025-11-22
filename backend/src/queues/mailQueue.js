import { Queue } from 'bullmq';
import redisQueue from '../config/redis-queue.js';

const mailQueue = new Queue('mailQueue', {
    connection: redisQueue,
});

export default mailQueue;
