import { redis } from './redis.js';

export async function initRedisExpirationListener(io) {
    const subscriber = redis.duplicate();

    console.log('🔔 Redis expiration subscriber initialized');

    // Use pattern subscription (required for keyspace notifications)
    await subscriber.psubscribe('__keyevent@0__:expired');

    subscriber.on('pmessage', (pattern, channel, key) => {
        if (!key.startsWith('reservation:event:')) return;

        const parts = key.split(':');
        const eventId = parts[2];
        const seatPart = parts[4];

        if (!seatPart) return;

        const [row, number] = seatPart.split('-');

        console.log(`⏰ Seat expired → Event ${eventId}, Seat ${seatPart}`);

        io.to(`event-${eventId}`).emit('seat:update', {
            row: Number(row),
            number: Number(number),
            status: 'available',
        });
    });
}