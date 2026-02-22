import { HOSTNAME, PORT } from './config/env.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initRedisExpirationListener } from './config/redisSubscriber.js';
import { initSocket } from './config/socket.js';
import { setIO } from './config/socketInstance.js';
import app from './app.js';

import http from 'http';

async function startServer() {
    try {
        // Connect Redis
        await connectRedis();

        // Connect Database
        await connectDB();

        // Create HTTP server
        const server = http.createServer(app);

        // Initialize Socket.IO (separated file)
        const io = initSocket(server);
        setIO(io);
        // Make io accessible inside controllers
        app.set('io', io);

        // Initialize Redis expiration listener
        await initRedisExpirationListener(io);

        // Start server
        server.listen(PORT, () => {
            console.log(`🚀 APP STARTED ON http://${HOSTNAME}:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
