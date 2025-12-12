import organizerFactory from '../factories/organizer.factory.js';

async function seedOrganizers(prisma, { users }) {
    let organizers = [];
    console.log('🌱 Seeding organizers...');
    for (let i = 1; i <= 5; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const organizer = await prisma.organizer.create({
            data: {
                ...organizerFactory(),
                userId: user.id,
            },
        });
        organizers.push(organizer);
    }
    console.log('✅ Organizers seeded.');
    return organizers;
}

export default seedOrganizers;