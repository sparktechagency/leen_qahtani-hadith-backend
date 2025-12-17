import express, { NextFunction } from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
const router = express.Router();

router.get(
    '/profile',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    UserController.getUserProfile
);

router.post("/store-app-id",
    UserController.storeAppId
);

router.get("/get-all-app-ids",
    UserController.getallappId
);

router.get("/app-ids-statistics",
    UserController.appIdsStatistics
);
router.post(
    '/create-admin',
    validateRequest(UserValidation.createAdminZodSchema),
    UserController.createAdmin
);

router.put(
    '/profile',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    fileUploadHandler(),
    UserController.updateProfile
);

export const UserRoutes = router;