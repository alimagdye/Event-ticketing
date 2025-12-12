import asyncWrapper from '../middlewares/asyncWrapper.js';
import { sendSuccess, sendFail, sendError } from '../utils/response.js';
import userService from '../services/userService.js';

const userController = {
    upgradeToOrganizer: asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const result = await userService.upgradeToOrganizer(userId);
        
        if (result.status === 'fail') {
            return sendFail(res, result.data);
        }
        
        return sendSuccess(res, result.data, 200);
    }),
};

export default userController;
