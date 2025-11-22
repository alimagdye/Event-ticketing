import jsend from './../config/jsend.js';

function sendSuccess(res, data, status = 200) {
    return res.status(status).json(jsend.success(data));
}

function sendFail(res, data, status = 400) {
    return res.status(status).json(jsend.fail(data));
}

function sendError(res, message, code = null, data = null, status = 500) {
    return res.status(status).json(jsend.error(message, code, data));
}

export { sendSuccess, sendFail, sendError };
