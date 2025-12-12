import { faker } from '@faker-js/faker';
function venueFactory() {
    return {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        googlePlaceId: `ChIJ${faker.string.alphanumeric(20)}`,
        country: faker.location.country(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
    };
}

export default venueFactory;
