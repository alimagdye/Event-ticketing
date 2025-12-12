import authService from '../services/authService.js';
import { sendSuccess, sendFail, sendError } from '../utils/response.js';
import {
    CALLBACK_URL,
    CLIENT_ID,
    CLIENT_SECRET,
    HOSTNAME,
    PORT,
    GOOGLE_REDIRECT_URL,
} from '../config/env.js';
import { google } from 'googleapis';
import { AuthThirdPartyService } from '../services/thirdPartyAuthService.js';

const authController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const result = await authService.register({ name, email, password });

            if (result.status === 'fail') {
                return sendFail(res, result.data, 400);
            }

            return sendSuccess(res, result.data, 201);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
        }
    },

    async verifyOtp(req, res) {
        try {
            const user = req.user;
            const { otp } = req.body;

            const result = await authService.verifyOtp(user, otp);

            if (result.status === 'fail') {
                return sendFail(res, result.data, 400);
            }

            return sendSuccess(res, result.data, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });

            if (result.status === 'fail') {
                return sendFail(res, result.data, 400);
            }

            return sendSuccess(res, result.data, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
        }
    },

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            const result = await authService.refreshToken({ refreshToken });

            if (!result || result.status === 'fail') {
                return sendFail(res, result.data, 403);
            }

            return sendSuccess(res, result, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Invalid or expired refresh token', 'INVALID_REFRESH', null, 403);
        }
    },

    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            const user = req.user;
            const accessToken = req.accessToken;

            const result = await authService.logout({ user, accessToken, refreshToken });
            if (!result || result.status === 'fail') {
                return sendFail(res, result.data, 400);
            }
            return sendSuccess(res, result.data, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Logout failed', 'LOGOUT_ERROR', null, 500);
        }
    },

    async resendOtp(req, res) {
        try {
            const user = req.user;

            const result = await authService.sendOtpMail(user, false);

            if (result.status === 'fail') {
                return sendFail(res, result.data, 400);
            }

            return sendSuccess(res, result.data, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
        }
    },

    async requestResetPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await authService.requestResetPassword({ email });

            return sendSuccess(res, result.data, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
        }
    },

    async resetPassword(req, res) {
        try {
            const { email, token, newPassword } = req.body;
            const result = await authService.resetPassword({ email, token, newPassword });

            if (result.status === 'fail') return sendFail(res, result.data, 400);

            return sendSuccess(res, result.data, 200);
        } catch (err) {
            console.error(err);
            return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
        }
    },
};

export default authController;
class GoogleAuthController extends AuthThirdPartyService {
    constructor() {
        super();
        this.oauth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            'http://' + 'localhost' + ':' + PORT + CALLBACK_URL
        );
    }

    getAuthUrl = async (req, res) => {
        try {
            const url = this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                prompt: 'consent',
                scope: ['profile', 'email'],
            });
            return sendSuccess(res, { url });
        } catch (err) {
            return sendError(
                res,
                'Failed to generate Google auth URL',
                'OAUTH2_URL_ERROR',
                null,
                500
            );
        }
    };

    handleCallback = async (req, res) => {
        const code = req.query.code;
        if (!code) return sendFail(res, { error: 'Missing code' });

        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            const { id_token } = tokens;
            if (!id_token) return sendFail(res, { error: 'Missing id_token' });

            const ticket = await this.oauth2Client.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const { email, name, sub: providerId } = ticket.getPayload();

            const user = await this.createOrFetchUser(email, name, 'GOOGLE', providerId);
            if (!user) {
                return sendError(
                    res,
                    'Failed to create or fetch user',
                    'USER_FETCH_ERROR',
                    null,
                    500
                );
            }

            const result = await this.generateJwt(user);
            if (result.status === 'fail') return sendFail(res, result.data, 400);

            const accessToken = result.data.accessToken?.token;
            const refreshToken = result.data.refreshToken;
            const expiresIn = result.data.accessToken?.expiresIn;

            const redirectUrl = `${GOOGLE_REDIRECT_URL}?token=${encodeURIComponent(accessToken)}&expiresIn=${encodeURIComponent(expiresIn)}&refreshToken=${encodeURIComponent(refreshToken)}`;

            return res.redirect(redirectUrl);
        } catch (error) {
            console.error(error);
            return sendError(res, 'Google OAuth2 authentication failed', 'OAUTH2_ERROR', null, 500);
        }
    };
}

export const googleAuthController = new GoogleAuthController();
