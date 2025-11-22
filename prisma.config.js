import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    seed: {
        provider: 'node',
        command: 'node prisma/seed.js',
    },
});
