import { param, body } from 'express-validator';
import userLanguage from '../constants/enums/userLanguage.js';

const newsletterValidations = {
    subscribe: [
        body('email')
            .isEmail()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
            .withMessage('A valid email is required.'),
        body('language').isIn(Object.values(userLanguage)).withMessage('Wrong language code.'),
    ],
    confirm: [
        param('token')
            .exists()
            .withMessage('Token is required')
            .isString()
            .withMessage('Token must be a string')
            .notEmpty()
            .withMessage('Token cannot be empty'),
    ],
};

export default newsletterValidations;
