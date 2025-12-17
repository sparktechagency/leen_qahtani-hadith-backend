import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { get } from 'mongoose';
import app from '../../../app';

// register user
const storeAppId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    await UserService.storeAppIdToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User appId stored successfully',
    })
});

const appIdsStatistics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.appIdsStatisticsToDB();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'App IDs statistics retrieved successfully',
        data: result
    });
});

const getallappId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getallappIdToDB();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All appIds retrieved successfully',
        data: result
    });
});

// register admin
const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createAdminToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin created successfully',
        data: result
    });
});

// retrieved user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.getUserProfileFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result
    });
});


const updateProfile = catchAsync(async (req, res) => {
    const user = req.user as { id: any };

    const data: any = { ...req.body };

    if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.image?.[0]) {
            data.profile = `/images/${files.image[0].filename}`;
        }
    }

    console.log("UPDATE DATA:", data);

    const result = await UserService.updateProfileToDB(user, data);

    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile updated successfully",
        data: result
    });
});

//update profile
const updateLocation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = {
        longitude: Number(req.body.longitude),
        latitude: Number(req.body.latitude)
    }
    const result = await UserService.updateLocationToDB(user, payload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User Location Updated successfully',
        data: result
    });
});

export const UserController = {
    storeAppId,
    createAdmin,
    getUserProfile,
    updateProfile,
    updateLocation,
    getallappId,
    appIdsStatistics
};