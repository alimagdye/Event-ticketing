import eventFactory from '../factories/event.factory.js';
async function seedEvents(prisma, { categories, venues, organizers }) {
    let events = [];
    console.log('🌱 Seeding events...');
    for (let i = 0; i < 10; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const venue = venues[Math.floor(Math.random() * venues.length)];
        const organizer = organizers[Math.floor(Math.random() * organizers.length)];
        
        const event = await prisma.event.create({
            data: {
                ...eventFactory(),
                categoryId: category.id,
                venueId: venue.id,
                organizerId: organizer.id,
            },
        });
        events.push(event);
    }
    console.log('✅ Events seeded.');
    return events;
}

export default seedEvents;
