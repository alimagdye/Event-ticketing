import { faker } from '@faker-js/faker';
import EventType from './../../src/constants/enums/eventType.js';
import EventMode from './../../src/constants/enums/eventMode.js';
function eventFactory(overrides = {}) {
    const eventTypes = Object.values(EventType);
    const eventModes = Object.values(EventMode);

    return {
        title: faker.lorem.words({ min: 3, max: 7 }),
        description: faker.lorem.paragraphs({ min: 1, max: 3 }),
        date: faker.date.future(),
        type: faker.helpers.arrayElement(eventTypes),
        mode: faker.helpers.arrayElement(eventModes),
        capacity: faker.number.int({ min: 10, max: 500 }),
        price: faker.number.float({ min: 0, max: 500, precision: 0.01 }),
        bannerPath: faker.image.urlLoremFlickr({ category: 'events' }),
        bannerDisk: 'external',
        ...overrides,
    };
}



export default eventFactory;