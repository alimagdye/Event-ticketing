import { sendFail, sendError } from '../utils/response.js';

function errorHandler(err, req, res, next) {
    if (err.code && err.code.startsWith('P')) {
        return handlePrismaError(err, req, res);
    }

    if (err.isOperational) {
        return handleAppError(err, req, res);
    }
    next(err);
}

function handleAppError(err, req, res) {
    const statusCode = err.statusCode || 500;
    return sendError(res, err.message, err.code, null, statusCode);
}
function handlePrismaError(err, req, res) {
    switch (err.code) {
        case 'P2002':
            return sendFail(res, { message: 'Unique constraint failed' }, 400);
        case 'P2025':
            return sendFail(res, { message: 'Record not found' }, 404);
        case 'P2003':
            return sendFail(res, { message: 'Foreign key constraint failed' }, 400);
        case 'P2000':
            return sendFail(res, { message: 'Value too long for the field' }, 400);
        default:
            return sendError(res, 'Database error occurred', 500);
    }
}

export { errorHandler };