import { prisma } from '../src/config/db.js';

//! Seeders
import seedUsers from './seeders/user.seeder.js';

async function main() {
    console.log('🚀 Starting database seed...');
    await seedUsers(prisma);
    console.log('🌱 All seeders completed.');
}

(async () => {
    try {
        await main();
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();
