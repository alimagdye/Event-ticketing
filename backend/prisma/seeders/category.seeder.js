import categoryFactory from '../factories/category.factory.js';
async function categorySeeder(prisma) {
    let categories = [];
    console.log('🌱 Seeding categories...');
    for (let i = 0; i < 10; i++) {
        const category = await prisma.category.create({
            data: categoryFactory(),
        });
        categories.push(category);
    }
    console.log('✅ Categories seeded.');
    return categories;
}


export default categorySeeder;