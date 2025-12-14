import express, { NextFunction, Request, Response } from 'express';
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import multer from 'multer';
import { HadithController } from './hadith.controller';
import { HadithzodSchema } from './hadith.validation';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import validateRequest from '../../middlewares/validateRequest';
import { get } from 'mongoose';
const router = express.Router();

router
    .route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),

        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const payload = req.body;

                let icon = null;

                if (req.files && "icon" in req.files && req.files.icon[0]) {
                    icon = `/icon/${req.files.icon[0].filename}`;
                }

                req.body = { ...payload, icon };
                next();

            } catch (error) {
                return res.status(500).json({ message: "Failed to convert string to number" });
            }
        },
        validateRequest(HadithzodSchema.createHadithZodSchema),
        HadithController.createHadith
    )
    .get(
        HadithController.getAllHadith
    )
;

router.get("/by-category/:category",
    HadithController.getHadithByCategory
)
router.get("/by-daily",
    HadithController.getHadithByDaily
)
router.patch(
    "/:id",
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = req.body;
            let icon;

            if (req.files && "icon" in req.files && req.files.icon[0]) {
                icon = `/icon/${req.files.icon[0].filename}`;
            }
            req.body = { ...payload, icon };
            next();

        } catch (error) {
            return res.status(500).json({ message: "Failed to convert string to number" });
        }
    },
    validateRequest(HadithzodSchema.updateHadithZodSchema),
    HadithController.updateHadith
)
router.delete(
    "/:id",
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    HadithController.deleteHadith
);

router.patch(
    "/status/:id",
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    HadithController.status
)
export const HadithRoutes = router;