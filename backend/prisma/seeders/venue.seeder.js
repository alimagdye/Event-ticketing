import venueFactory from "../factories/venue.factory.js";

async function seedVenues(prisma) {
    let venues = [];
    console.log("🌱 Seeding venues...");
    
    for (let i = 0; i < 10; i++) {
        const event = await prisma.venue.create({
            data: venueFactory(),
        });
        venues.push(event);
    }
    console.log("✅ Venues seeded.");
    return venues;
}

export default seedVenues;