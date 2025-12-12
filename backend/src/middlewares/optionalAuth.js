import jwt from 'jsonwebtoken';
import { JWT_KEY } from './../config/env.js';
import authService from '../services/authService.js';
async function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = {};
        return next();
    }

    const isAlive = await authService.isAccessAlive({ accessToken: token });

    if (!isAlive) {
        req.user = {};
        return next();
    }

    try {
        req.accessToken = token;
        req.user = jwt.verify(token, JWT_KEY);
    } catch (err) {
        req.user = {};
    }
    console.log('continue');
    next();
}
export default optionalAuth;
