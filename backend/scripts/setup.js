#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    step: (msg) => console.log(`\n${colors.cyan}${colors.bright}▶${colors.reset} ${colors.bright}${msg}${colors.reset}`),
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

function runScript(scriptPath, description) {
    try {
        log.info(`${description}...`);
        execSync(`node ${scriptPath}`, { stdio: 'inherit' });
        return true;
    } catch (error) {
        log.error(`${description} failed`);
        return false;
    }
}

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function setupEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');

    if (fileExists(envPath)) {
        log.warning('.env file already exists, skipping...');
        return true;
    }

    if (!fileExists(envExamplePath)) {
        log.warning('.env.example not found, you\'ll need to create .env manually');
        return false;
    }

    try {
        fs.copyFileSync(envExamplePath, envPath);
        log.success('.env file created from .env.example');
        log.warning('⚠️  Please update .env with your actual configuration values!');
        return true;
    } catch (error) {
        log.error('Failed to create .env file');
        return false;
    }
}

function createDirectories() {
    const directories = ['logs', 'uploads'];
    
    directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            log.success(`Created ${dir}/ directory`);
        } else {
            log.info(`${dir}/ directory already exists`);
        }
    });
}

function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().trim());
        });
    });
}

async function setup() {
    console.log(`
${colors.cyan}${colors.bright}╔═══════════════════════════════════════════════╗
║   Event Ticketing System - Setup Script      ║
╚═══════════════════════════════════════════════╝${colors.reset}
`);

    log.step('Step 1: Installing dependencies');
    if (!runCommand('npm install', 'Installing npm packages')) {
        log.error('Failed to install dependencies. Please check your npm installation.');
        process.exit(1);
    }

    log.step('Step 2: Setting up environment variables');
    setupEnvFile();

    log.step('Step 3: Creating project directories');
    createDirectories();

    log.step('Step 4: Generating Prisma Client');
    if (!runScript('scripts/generate.js', 'Generating Prisma Client')) {
        log.warning('Prisma Client generation failed. You may need to configure your database first.');
    }

    log.step('Step 5: Running database migrations');
    const runMigrations = await askQuestion(
        `${colors.yellow}Do you want to run database migrations now? (y/n): ${colors.reset}`
    );

    if (runMigrations === 'y' || runMigrations === 'yes') {
        if (!runScript('scripts/migrate.js', 'Running database migrations')) {
            log.warning('Migration failed. Make sure your database is running and .env is configured correctly.');
        }
    } else {
        log.info('Skipping migrations. Run "node scripts/migrate.js" manually when ready.');
    }

    log.step('Step 6: Seeding database');
    const runSeed = await askQuestion(
        `${colors.yellow}Do you want to seed the database with sample data? (y/n): ${colors.reset}`
    );

    if (runSeed === 'y' || runSeed === 'yes') {
        if (!runScript('scripts/seed.js', 'Seeding database')) {
            log.warning('Seeding failed. Make sure migrations have been run successfully.');
        }
    } else {
        log.info('Skipping database seeding. Run "node scripts/seed.js" manually when ready.');
    }

    console.log(`
${colors.green}${colors.bright}╔═══════════════════════════════════════════════╗
║              Setup Completed! 🎉              ║
╚═══════════════════════════════════════════════╝${colors.reset}

${colors.cyan}Next steps:${colors.reset}
  1. Update your .env file with actual configuration values
  2. Make sure your database is running
  3. Make sure Redis is running
  4. Run: ${colors.bright}npm run run:dev${colors.reset} to start the development server

${colors.cyan}Available commands:${colors.reset}
  ${colors.bright}npm run run:dev${colors.reset}         - Start development server
  ${colors.bright}npm run run:start${colors.reset}       - Start production server
  ${colors.bright}node scripts/migrate.js${colors.reset}    - Run database migrations
  ${colors.bright}node scripts/seed.js${colors.reset}       - Seed database with data
  ${colors.bright}node scripts/generate.js${colors.reset}   - Generate Prisma Client

${colors.yellow}⚠️  Don't forget to configure your .env file!${colors.reset}
`);
}

setup().catch((error) => {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
});

