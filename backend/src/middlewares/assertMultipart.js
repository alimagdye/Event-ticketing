import { sendFail } from "../utils/response.js";

function assertMultipart(req, res, next) {
    if (!req.is('multipart/form-data')) {
        return sendFail(res, { error: 'Content-Type must be multipart/form-data' }, 415);
    }
    next();
}

export default assertMultipart;