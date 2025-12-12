import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// prisma.$use(async (params, next) => {
//     const modelWithDeletedAt = ['Organizer', 'Event'];

//     if (modelWithDeletedAt.includes(params.model)) {
//         if (['findMany', 'findUnique', 'findFirst'].includes(params.action)) {
//             if (!params.args) params.args = {};
//             if (!params.args.where) params.args.where = {};
//             params.args.where.deletedAt = null;
//         }
//     }

//     return next(params);
// });

async function connectDB() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

export { prisma, connectDB };
