import { param, body } from 'express-validator';

const eventValidation = {
    show: [
        param('id')
            .exists()
            .withMessage('Event ID is required')
            .toInt(10)
            .isInt({ gt: 0 })
            .withMessage('Event ID must be a positive integer'),
    ],

    checkout: [
        param('id')
            .exists()
            .withMessage('Event ID is required')
            .toInt(10)
            .isInt({ gt: 0 })
            .withMessage('Event ID must be a positive integer'),

        body('tickets.*.name')
            .exists()
            .withMessage('Ticket name is required')
            .trim()
            .isString(),
        body('tickets.*.quantity')
            .exists()
            .withMessage('Ticket quantity is required')
            .toInt(10)
            .isInt({ gt: 0 })
            .withMessage('Ticket quantity must be a positive integer'),
        
    ],
};

export default eventValidation;
