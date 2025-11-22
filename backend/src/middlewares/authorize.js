import { sendFail } from '../utils/response';

const authorize = {
    isAdmin (req, res, next) {
        if(req.user?.role === 'ADMIN') return next();
    return sendFail(res, {error: `Access denied: admin only`}, 403);
    },

    isOrganizer (req, res, next) {
        if(req.user?.role === 'ORGANIZER') return next();
    return sendFail(res, {error: `Access denied: organizer only`}, 403);
    }
}

export default authorize;