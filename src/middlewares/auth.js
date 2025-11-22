import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';
import { JWT_KEY } from './../config/env.js';
import authService from '../services/authService.js';
async function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return sendError(res, 'No auth token provided', null, null,401);
    }
    
    const isAlive = await authService.isAccessAlive({ accessToken: token });
    if (!isAlive) {
        return sendError(res,  'Token revoked', 'REVOKED_TOKEN', null, 401)
    }

    try {
        req.accessToken = token;
        req.user = jwt.verify(token, JWT_KEY);
        next(); 
    } catch (error) {
        return sendError(res,'Invalid auth token.', null, null,403);
    }
}


export default auth;
