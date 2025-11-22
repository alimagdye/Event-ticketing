#!/usr/bin/env node

import { execSync } from 'child_process';

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

function runCommand(command, description) {
    try {
        log.info(`${description}...`);
        execSync(command, { stdio: 'inherit' });
        log.success(`${description} completed`);
        return true;
    } catch (error) {
        log.error(`${description} failed`);
        return false;
    }
}

console.log(`
${colors.bright}Running Database Migrations...${colors.reset}
`);

if (!runCommand('npx prisma migrate dev', 'Running database migrations')) {
    log.error('Migration failed. Make sure your database is running and .env is configured correctly.');
    process.exit(1);
}

console.log(`
${colors.green}${colors.bright}Migrations completed successfully!${colors.reset}
`);

