import { Worker } from 'bullmq';
import redisQueue from '../config/redis-queue.js';
import sendMail from '../utils/mailer.js';

const mailWorker = new Worker(
    'mailQueue',
    async (job) => {
        const { to, subject, html, text } = job.data;

        try {
            await sendMail({ to, subject, html, text });
            return { success: true, to };
        } catch (error) {
            console.error('❌ Failed to send email:', error.message);
            throw error;
        }
    },
    { connection: redisQueue }
);

mailWorker.on('completed', (job) => {
    console.log(`✅ Mail job ${job.id} completed successfully`);
});

mailWorker.on('failed', (job, err) => {
    console.error(`❌ Mail job ${job?.id} failed: ${err.message}`);
});

export default mailWorker;
