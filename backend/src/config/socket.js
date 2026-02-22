import { Server } from 'socket.io';

export function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log('🟢 Client connected:', socket.id);

        // Join event room
        socket.on('join-event', (eventId) => {
            socket.join(`event-${eventId}`);
            console.log(`📌 Socket ${socket.id} joined event-${eventId}`);
        });

        socket.on('disconnect', () => {
            console.log('🔴 Client disconnected:', socket.id);
        });
    });

    return io;
}
