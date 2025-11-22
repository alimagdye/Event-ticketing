import jwt from 'jsonwebtoken';
import {FRONT_URL, JWT_KEY, JWT_REKEY} from './../config/env.js';
import {hashPassword, hashToken, matchPassword, matchToken, hashHMAC, hashSHA} from './../utils/hash.js';
import userService from './userService.js';
import mailService from './mailService.js';
import otpService from './otpService.js';
import cacheService from "./cacheService.js";
import {prisma as prismaClient} from '../config/db.js';
import crypto from 'crypto';

const authService = {
    JWT_EXPIRATION: 15 * 60, // 15 minutes
    REFRESH_EXPIRATION: 7 * 24 * 60 * 60, // 7 days
    PASSWORD_RESET_EXPIRATION: 60 * 60, // 1 hour
    OTP_EXPIRATION: 10 * 60, // 10 minutes
    ACCESS_CACHE_PREFIX: 'auth:rt:',
    
    async register(user) {
        const createdUser = await userService.create(user);

        if (createdUser.status === 'fail') {
            return createdUser;
        }
        
        const { accessToken, type, expiresIn} = authService.generateAccessToken(createdUser);
        const [refreshToken] = await Promise.all([
            authService.generateRefreshToken(createdUser),
            authService.sendOtpMail(createdUser, true)
        ]);
        
        return {
            data: {
                accessToken: {
                    token: accessToken,
                    type: type,
                    expiresIn: expiresIn,
                },
                refreshToken: refreshToken
            },
        };
    },

    async login(user) {
        const exists = await userService.findByEmail(user.email);

        if (!exists) {
            return {
                status: 'fail',
                data: { error: 'Invalid credentials' },
            };
        }

        const isPasswordValid = await matchPassword(user.password, exists.password);

        if (!isPasswordValid) {
            return {
                status: 'fail',
                data: { error: 'Invalid credentials' },
            };
        }
        
        const { accessToken, type, expiresIn} = authService.generateAccessToken(exists);
        const refreshToken = await authService.generateRefreshToken(exists);
        
        return {
            data: {
                accessToken: {
                    token: accessToken,
                    type: type,
                    expiresIn: expiresIn,
                },
                refreshToken: refreshToken,
            }
        };
    },

     generateAccessToken(user) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, JWT_KEY, { expiresIn: authService.JWT_EXPIRATION });

        return {
            accessToken: token,
            type: 'Bearer',
            expiresIn: authService.JWT_EXPIRATION,
        };
    },

    async generateRefreshToken(user){
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const hashed = hashHMAC(refreshToken, JWT_REKEY);
        
        await prismaClient.refreshToken.create({
            data: {
                token: hashed,
                userId: user.id,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + (authService.REFRESH_EXPIRATION * 1000)),
            }
        });
        
        return refreshToken;
    },

    async refreshToken({ refreshToken }) {
        const hashed = hashHMAC(refreshToken, JWT_REKEY);
        const tokenRecord = await prismaClient.refreshToken.findFirst({
            where: { token: hashed, isRevoked: false },
            include: { user: true },
        });
        
        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            return {
                status: 'fail',
                data: { error: 'Invalid or expired refresh token' },
            };
        }
        
        return authService.generateAccessToken(tokenRecord.user);
    },

    async logout({ user, accessToken, refreshToken }){
        const hashed = hashHMAC(refreshToken, JWT_REKEY);
        const tokenRecord = await prismaClient.refreshToken.findFirst({
            where: { token: hashed, isRevoked: false },
            include: { user: true },
        });

        if(!tokenRecord || tokenRecord.expiresAt < new Date()) {
            return {
                status: 'fail',
                data: {error: 'Refresh token not found or already revoked'}
            };
        }

        if (tokenRecord.user.id === user.id) {
            const { cacheKey, ttl } = authService.accessTokenCache({ accessToken });
            await Promise.all([
                cacheService.set(cacheKey, true, ttl), 
                prismaClient.refreshToken.delete({
                    where: { id: tokenRecord.id },
                })
            ]);
        }
        
        return {
            status: 'success',
            data: { message: 'Logged out successfully' },
        };
    },

    async requestResetPassword({email}){
        const user = await userService.findByEmail(email);
        if(!user) return {status: 'success', data: {message: 'We have sent you email containing instructions to reset password'}};

        const token = crypto.randomBytes(32).toString('hex');
        const encodedEmail = encodeURIComponent(email);
        const URL = `${FRONT_URL}/reset-password?email=${encodedEmail}&token=${token}`;
        
        await Promise.all([
            authService.createPasswordToken(email, token),
            mailService.sendPasswordResetJob(user, URL, authService.PASSWORD_RESET_EXPIRATION),
        ]);

        return {
            status: 'success',
            data: {message: 'We have sent you email containing instructions to reset password'}
        };
    },

    async resetPassword({email, token, newPassword}){
        const record = await prismaClient.resetPasswordToken.findFirst({
            where: {email},
            orderBy: {createdAt: 'desc'},
        });

        const now = new Date();
        if (!record || now > new Date(record.expiresAt)) {
            return { status: 'fail', data: { error: 'Token expired or invalid' } };
        }

        const isValid = await matchToken(token, record.token);
        if(!isValid) return {status: 'fail', data: {error: 'Invalid token'}};

        const hashedNewPassword = await hashPassword(newPassword);

        await Promise.all([
            userService.updatePassword(email, hashedNewPassword),
            prismaClient.resetPasswordToken.delete({ where: { id: record.id } }),
        ]);

        return { status: 'success', data: { message: "Password reset successfully" } };
    },

    async createPasswordToken(email, token){
        await prismaClient.resetPasswordToken.deleteMany({where: {email}});

        const expiresAt = new Date(Date.now() + (authService.PASSWORD_RESET_EXPIRATION * 1000));
        const hashedToken = await hashToken(token);

        return prismaClient.resetPasswordToken.create({
            data: {email:email, token:hashedToken, expiresAt: expiresAt},
        })
    },
    
    async sendOtpMail(user, isFirstTime) {
        let userData = user;
        
        if (!isFirstTime) {
            userData = await userService.findByEmail(user.email);
        }
        
        if (userData.isVerified) {
            return {
                status: 'fail',
                data: { error: 'Email already verified' }
            };
        }
        
        const otp = otpService.generateOtp();
        
        await Promise.all([
            mailService.sendOtpJob(userData, otp, authService.OTP_EXPIRATION), 
            otpService.storeOrUpdateOtp(userData.email, otp, authService.OTP_EXPIRATION)
        ]);
        
        return {
            status: 'success',
            data: { message: 'OTP sent successfully' }
        };
    },
    
    async verifyOtp(user, otp) {
        const existingUser = await userService.findByEmail(user.email);
        
        if (existingUser.isVerified) {
            return {
                status: 'fail',
                data: { error: 'Email already verified' }
            };
        }
        
        const isValid = await otpService.verifyOtp(user.email, otp);
        
        if (!isValid || isValid.status === 'fail') {
            return isValid;
        }
        await otpService.deleteOtp(user.email);

        return {
            status: 'success',
            data: { message: 'Email verified successfully' }
        };
    },
    
    accessTokenCache({ accessToken }) {
        const decoded = jwt.decode(accessToken);
        const ttl = decoded ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1) : 3600;
        const tokenHash = hashSHA(accessToken);
        return { cacheKey:`${authService.ACCESS_CACHE_PREFIX}${tokenHash.slice(0, 24)}`, ttl };
    },
    
    async isAccessAlive({ accessToken }) {
        const { cacheKey } = authService.accessTokenCache({ accessToken });
        return !(await cacheService.exists(cacheKey));
    },
};

export default authService;