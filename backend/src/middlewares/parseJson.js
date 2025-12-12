import { sendFail } from '../utils/response.js';
function parseJsonFields(fields) {
    return (req, res, next) => {
        try {
            fields.forEach(field => {
                if (req.body[field] && typeof req.body[field] === 'string') {
                    req.body[field] = JSON.parse(req.body[field]);
                }
            });
            next();
        } catch (error) {
            return sendFail(res, { message: 'Invalid JSON format in form data' }, 400);
        }
    }
}

export default parseJsonFields;