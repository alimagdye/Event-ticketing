import userFactory from '../factories/user.factory.js';

async function seedUsers(prisma) {
    let users = [];
    console.log('🌱 Seeding users...');
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: await userFactory(),
        });
        users.push(user);
    }
    console.log('✅ Users seeded.');
    return users;
}

export default seedUsers;
