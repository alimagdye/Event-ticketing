import crypto from 'node:crypto';
import { prisma as prismaClient } from '../config/db.js';
import userService from './userService.js';

const otpService = {
    OTP_EXPIRATION: 10 * 60, // 10 minutes
    generateOtp() {
        return crypto.randomInt(100000, 999999).toString();
    },

    async storeOrUpdateOtp(email, code, expiresIn = otpService.OTP_EXPIRATION) {
        await prismaClient.otp.upsert({
            where: { email },
            update: {
                code,
                isUsed: false,
                expiresAt: new Date(Date.now() + (expiresIn * 1000)),
            },
            create: {
                email,
                code,
                isUsed: false,
                expiresAt: new Date(Date.now() + (expiresIn * 1000)),
            },
        });
    },

    async verifyOtp(email, otp) {
        const record = await prismaClient.otp.findUnique({ where: { email } });
        
        if (!record || record.code !== otp) {
            return { 
                status: 'fail', 
                data: { 'otp': 'Invalid OTP' }
            };
        }
        
        if (record.isUsed || new Date() > record.expiresAt) {
            return { 
                status: 'fail',
                data: { 'otp': 'OTP expired' }
            };
        }

        await userService.markVerified(email);
        return { 
            status: 'success', 
            data: { message: 'Email verified successfully' }
        };
    },
    
    async markUsed(email) {
        await prismaClient.otp.update({
            where: { email },
            data: { isUsed: true },
        });
    },

    async deleteOtp(email) {
        await prismaClient.otp.delete({
            where: {email},
        })
    }
};

export default otpService;