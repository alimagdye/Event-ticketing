import { faker } from '@faker-js/faker';
function categoryFactory() {
    return {
        name: faker.word.noun(),
    }
}
export default categoryFactory;