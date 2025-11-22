import userFactory from '../factories/user.factory.js';

async function seedUsers(prisma) {
    console.log('🌱 Seeding users...');
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: await userFactory(),
        });
    }
    console.log('✅ Users seeded.');
}

export default seedUsers;
