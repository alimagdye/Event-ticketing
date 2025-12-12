import AppError from './AppError.js';
import common from '../constants/errors/common.js'; 

class ConflictError extends AppError {
    constructor(message = common.CONFLICT, code = 'CONFLICT_ERROR') {
        super(message, 409, code);
        this.name = 'ConflictError';
    }
}

export default ConflictError;