import { body } from 'express-validator';
import Genders from '../constants/enums/userGender.js';
import GovernoratesNames from '../constants/enums/governoratesNames.js';
import { calculateAge } from '../utils/calculateAge.js';

const onboardingValidations = {
    updateBasic: [
        body('birthDate')
            .isISO8601()
            .withMessage('Birth date must be a valid ISO date (YYYY-MM-DD).')
            .custom((value) => {
                const age = calculateAge(value);
                if (age < 8 || age > 110) {
                    throw new Error('Age must be between 8 and 110.');
                }
                return true;
            }),

        body('gender').isIn(Object.values(Genders)).withMessage('Gender must be male or female'),
    ],
    updatePreferences: [
        body('preferences')
            .isArray()
            .withMessage('Preferences must be an array of strings')
            .bail()
            .custom((arr) => arr.length > 0)
            .withMessage('Preferences array must not be empty')
            .bail()
            .custom((arr) => arr.every((p) => typeof p === 'string'))
            .withMessage('Each preference must be a string'),
    ],
    updateLocation: [
        body('governorate')
            .trim()
            .isIn(Object.values(GovernoratesNames))
            .withMessage('Invalid governorate value'),
    ],
};

export default onboardingValidations;