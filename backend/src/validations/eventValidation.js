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

        body('tickets.*.name').exists().withMessage('Ticket name is required').trim().isString(),
        body('tickets.*.quantity')
            .exists()
            .withMessage('Ticket quantity is required')
            .toInt(10)
            .isInt({ gt: 0 })
            .withMessage('Ticket quantity must be a positive integer'),
    ],

    reserve: [
        param('id')
            .exists()
            .withMessage('Event ID is required')
            .toInt(10)
            .isInt({ gt: 0 })
            .withMessage('Event ID must be a positive integer'),

        body('tickets')
            .exists()
            .withMessage('Tickets are required')
            .isArray({ min: 1, max: 3 })
            .withMessage('You must reserve between 1 and 3 tickets'),

        body('tickets.*.seatInfo')
            .exists()
            .withMessage('seatInfo is required for each ticket')
            .isObject()
            .withMessage('seatInfo must be an object'),

        body('tickets.*.seatInfo.row')
            .exists()
            .withMessage('Seat row is required')
            .toInt(10)
            .isInt({ min: 0 })
            .withMessage('Seat row must be a non-negative integer'),

        body('tickets.*.seatInfo.number')
            .exists()
            .withMessage('Seat number is required')
            .toInt(10)
            .isInt({ min: 0 })
            .withMessage('Seat number must be a non-negative integer'),
    ],
};

export default eventValidation;
