import { faker } from '@faker-js/faker';
import { hashPassword } from './../../src/utils/hash.js';

const PASSWORD = 'password@12345';

async function userFactory() {
    return {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: await hashPassword(PASSWORD),
    };
}

export default userFactory;
