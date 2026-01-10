import { prisma } from '../config/db.js';
import { sendSuccess, sendFail, sendError } from '../utils/response.js';
import sanitize from 'sanitize-html';

class OnboardingController {
    handleError = (res, error) => {
        console.error(error);

        if (error.code === 'P2025') {
            return sendFail(res, { message: 'Attendee not found' }, 404);
        }
        if (error.code === 'P2002') {
            return sendFail(res, { message: 'Preferences already set' }, 400);
        }

        if (error.name === 'JsonWebTokenError' || error.message.includes('token')) {
            return sendFail(res, { message: 'Invalid token' }, 401);
        }

        return sendError(res, 'Internal server error', 'INTERNAL_ERROR', null, 500);
    };

    getStatus = async (req, res) => {
        try {
            const id = req.user.id;

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return sendFail(res, { message: 'User not found' }, 404);
            }
            if (user.isVerified === false) {
                return sendFail(res, { message: 'User email not verified' }, 403);
            }

            const missing = [];
            if (!user.birthDate) missing.push('basic');
            if (!user.governorateId) missing.push('governorate');

            const hasPreferences = await prisma.attendeeFavoriteCategory.findFirst({
                where: { attendeeId: id },
            });
            if (!hasPreferences) missing.push('preferences');

            const isComplete = missing.length === 0;
            if (isComplete) {
                await prisma.user.update({
                    where: { id },
                    data: { isCompleted: true },
                });
            }

            return sendSuccess(res, { isComplete: isComplete, missing }, 200);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updateBasic = async (req, res) => {
        try {
            const { id } = req.user;
            const birthDate = new Date(sanitize(req.body.birthDate));
            const gender = sanitize(req.body.gender);

            if (!birthDate || !gender) {
                return sendFail(res, { message: 'Missing required fields' }, 400);
            }

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return sendFail(res, { message: 'User not found' }, 404);
            }
            if (user.isVerified === false) {
                return sendFail(res, { message: 'User email not verified' }, 403);
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    birthDate,
                    gender,
                },
            });

            return sendSuccess(
                res,
                {
                    message: 'Basic profile info created successfully',
                    user: {
                        id: updatedUser.id,
                        birthDate: updatedUser.birthDate,
                        gender: updatedUser.gender,
                    },
                },
                200
            );
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updatePreferences = async (req, res) => {
        try {
            const { id } = req.user;
            const preferences = req.body.preferences?.map((preference) => sanitize(preference));

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return sendFail(res, { message: 'User not found' }, 404);
            }
            if (user.isVerified === false) {
                return sendFail(res, { message: 'User email not verified' }, 403);
            }

            if (!preferences || preferences.length === 0) {
                return sendFail(res, { message: 'No preferences provided' }, 400);
            }

            const categories = await prisma.category.findMany({
                where: { name: { in: preferences } },
            });

            if (categories.length === 0) {
                return sendFail(res, { message: 'No valid categories found' }, 400);
            }

            await Promise.all(
                categories.map((category) =>
                    prisma.attendeeFavoriteCategory.create({
                        data: { attendeeId: id, categoryId: category.id },
                    })
                )
            );

            return sendSuccess(
                res,
                { message: 'Preferences updated successfully', preferences },
                200
            );
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updateLocation = async (req, res) => {
        try {
            const { id } = req.user;
            const governorateName = sanitize(req.body.governorate).trim();
            console.log(governorateName);
            if (!governorateName) {
                return sendFail(res, { message: 'Governorate is required' }, 400);
            }

            const user = await prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                return sendFail(res, { message: 'User not found' }, 404);
            }
            if (user.isVerified === false) {
                return sendFail(res, { message: 'User email not verified' }, 403);
            }

            const governorate = await prisma.governorate.findUnique({
                where: { name: governorateName },
            });

            const governorateId = governorate?.id;

            if (!governorate) {
                console.log(governorate);
                return sendFail(res, { message: 'Governorate not found' }, 404);
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    governorateId,
                },
            });

            return sendSuccess(
                res,
                {
                    message: 'Location updated successfully',
                    attendee: {
                        id: updatedUser.id,
                        governorate: updatedUser.governorate,
                    },
                },
                200
            );
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

export const onboardingController = new OnboardingController();
