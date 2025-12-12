import { param } from 'express-validator';

const orderValidation = {
    status: [
        param('id')
            .exists()
            .withMessage('Order ID is required')
            .isUUID()
            .withMessage('Order ID must be a valid UUID'),
    ],
};
export default orderValidation;
