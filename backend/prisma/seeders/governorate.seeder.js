// Seeds Governorate & GovernorateRelation based on Haversine ranking
import fs from 'node:fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'governorates.json');
const { governorates } = JSON.parse(await fs.readFile(filePath, 'utf8'));

// Create fast lookup: { CAIRO: { name: 'CAIRO', latitude: 30.033333, longitude: 31.233334 }, ALEXANDRIA: { name: 'ALEXANDRIA', latitude: 31.2000924, longitude: 29.9187387 }, ... }
const governorateMap = Object.fromEntries(
    governorates.map((governorate) => [governorate.name, governorate])
);

const toRadian = function (degree) {
    return (degree * Math.PI) / 180;
};

const haversine = function (start, end) {
    const RADIUS = 6371;
    const distanceLatitude = toRadian(end.latitude - start.latitude);
    const distanceLongitude = toRadian(end.longitude - start.longitude);
    const startLatitude = toRadian(start.latitude);
    const endLatitude = toRadian(end.latitude);

    const h =
        Math.sin(distanceLatitude / 2) ** 2 +
        Math.sin(distanceLongitude / 2) ** 2 * Math.cos(startLatitude) * Math.cos(endLatitude);

    return 2 * RADIUS * Math.asin(Math.sqrt(h));
};

// [ 'CAIRO', 'GIZA', ... ]
const governorateNames = Object.keys(governorateMap);

const buildRankMap = function () {
    const rankMap = {};

    for (const governorateName of governorateNames) {
        const currentGovernorateName = governorateMap[governorateName];
        const distances = [];

        for (const other of governorateNames) {
            distances.push({
                governorateName: other,
                distance: haversine(currentGovernorateName, governorateMap[other]),
            });
        }

        distances.sort((a, b) => a.distance - b.distance);

        rankMap[governorateName] = distances.map((item, index) => ({
            governorateName: item.governorateName,
            distance: Number(item.distance.toFixed(1)),
            rank: index + 1,
        }));
    }

    return rankMap;
};

//    MATROUH: [
//     { governorateName: 'ALEXANDRIA', distance: 255.4, rank: 1 },
//     { governorateName: 'BEHEIRA', distance: 309.4, rank: 2 },
//     { governorateName: 'KAFR_EL_SHEIKH', distance: 353.3, rank: 3 },
//     { governorateName: 'GHARBIA', distance: 363.9, rank: 4 },
//     { governorateName: 'MENOUFIA', distance: 370.2, rank: 5 },
//     { governorateName: 'QALYUBIA', distance: 389.3, rank: 6 },
const rankMap = buildRankMap();

const seedGovernorates = async function (prisma) {
    console.log('Seeding Governorates...');

    for (const governorateName in rankMap) {
        const data = governorateMap[governorateName];

        await prisma.governorate.upsert({
            where: { name: governorateName },
            update: {},
            create: {
                name: governorateName,
                latitude: data.latitude,
                longitude: data.longitude,
                otherGovsIdsSorted: [],
            },
        });
    }

    console.log('Seeding nearest governorates (otherGovsIdsSorted)...');

    for (const fromName in rankMap) {
        const fromGov = await prisma.governorate.findUnique({
            where: { name: fromName },
        });

        const orderedIds = [];

        for (const entry of rankMap[fromName]) {
            const toGov = await prisma.governorate.findUnique({
                where: { name: entry.governorateName },
            });

            orderedIds.push(toGov.id);
        }

        await prisma.governorate.update({
            where: { id: fromGov.id },
            data: { otherGovsIdsSorted: orderedIds },
        });
    }

    console.log('Seeding completed!');
};

export default seedGovernorates;
