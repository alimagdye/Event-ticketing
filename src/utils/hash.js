import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const SALT_ROUNDS = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function matchPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

async function hashToken(token) {
    return await bcrypt.hash(token, SALT_ROUNDS);
}

async function matchToken(token, hashedToken) {
    return await bcrypt.compare(token, hashedToken);
}

function hashHMAC(token, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(token)
        .digest('hex');
}

function hashSHA(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}

export { hashPassword, matchPassword, hashToken, matchToken, hashHMAC, hashSHA };
