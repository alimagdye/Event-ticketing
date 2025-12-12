import { sendFail } from '../utils/response.js';
import userRoles from '../constants/enums/userRoles.js';

const authorize = {
    isAdmin (req, res, next) {
        if(req.user?.role === userRoles.ADMIN) return next();
        return sendFail(res, {error: `Access denied: admin only`}, 403);
    },

    isOrganizer (req, res, next) {
        if(req.user?.role === userRoles.ORGANIZER) return next();
        return sendFail(res, {error: `Access denied: organizer only`}, 403);
    }
}

export default authorize;