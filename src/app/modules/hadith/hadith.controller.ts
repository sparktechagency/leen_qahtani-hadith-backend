import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { HadithService } from "./hadith.service";  
import { Ihadith } from "./hadith.interface";
import { boolean } from "zod";

const createHadith = catchAsync(async (req: Request, res: Response) => {
    const { ...hadithData } = req.body;
    const result = await HadithService.createHadithToDB(hadithData);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Hadith created successfully',
        data: result
    });
})
const getAllHadith = catchAsync(async (req: Request, res: Response) => {
    const result = await HadithService.getAllHadithFromDB();
    sendResponse<Ihadith[]>(res, {  
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All Hadith retrieved successfully',
        data: result
    });
})

const getHadithByDaily = catchAsync(async (req: Request, res: Response) => {
    const dailyQuery = req.query.daily;
    const daily = dailyQuery === "true";

    const result = await HadithService.getHadithByDailyFromDB(daily);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Hadiths retrieved successfully for daily=${daily}`,
        data: result,
    });
});

const getHadithByCategory = catchAsync(async (req: Request, res: Response) => {
    const category = req.params.category;
    const result = await HadithService.getHadithByCategoryFromDB(category);
    sendResponse<Ihadith[]>(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Hadiths retrieved successfully for category: ${category}`,
        data: result
    });
});

const updateHadith = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...updateData } = req.body;
    const result = await HadithService.updateHadithToDB(id, updateData);

    sendResponse<Ihadith | null>(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hadith updated successfully',
        data: result
    });
})

const deleteHadith = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await HadithService.deleteHadithFromDB(id);
    sendResponse<Ihadith | null>(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hadith deleted successfully',
        data: result
    });
});
const status = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await HadithService.status(id);
    sendResponse<Ihadith | null>(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hadith status updated successfully',
        data: result
    });
});

export const HadithController = {
    createHadith,
    getAllHadith,
    getHadithByCategory,
    getHadithByDaily,
    updateHadith,
    deleteHadith,
    status

}