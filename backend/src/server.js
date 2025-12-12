import { HOSTNAME, PORT } from './config/env.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import app from './app.js';

async function startServer() {
    try {
        await connectRedis();
        await connectDB();

        app.listen(PORT, () => {
            console.log(`APP STARTED ON http://${HOSTNAME}:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();