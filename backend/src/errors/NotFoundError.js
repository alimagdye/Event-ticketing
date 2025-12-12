import AppError from "./AppError.js";

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export default NotFoundError;