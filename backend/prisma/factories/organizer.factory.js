import { faker  } from '@faker-js/faker';

function organizerFactory(overrides = {}) {
    return {
        isApproved: faker.datatype.boolean(),
        ...overrides,
    };
}

export default organizerFactory;