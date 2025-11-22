import { validationResult } from 'express-validator';
import { sendFail } from '../utils/response.js';

function validate(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = {};
    for (const err of result.array()) {
        const field = err.param || err.path || 'general';
        if (!errors[field]) errors[field] = err.msg;
    }

    return sendFail(res, errors, 422);
}

export default validate;
