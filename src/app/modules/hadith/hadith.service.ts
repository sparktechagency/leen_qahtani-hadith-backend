import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Ihadith } from "./hadith.interface";
import { Hadith } from "./hadith.model";

//create hadith
 const createHadithToDB = async (payload: Ihadith): Promise<Ihadith> => {
    const createHadith: any = await Hadith.create(payload);
    if (!createHadith) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Hadith');
    }
    return createHadith;
};

 const getAllHadithFromDB = async (): Promise<Ihadith[]> => {
    const hadiths = await Hadith.find().sort({ createdAt: -1 })
    .populate('category');
    return hadiths;
};

const gethadithByIdFromDB = async (id: string): Promise<Ihadith | null> => {
    const hadith = await Hadith.findById(id).populate('category');
    return hadith;
};

 const getHadithByCategoryFromDB = async (category: string): Promise<Ihadith[]> => {
    const hadiths = await Hadith.find({ category }).sort({ createdAt: -1 }).populate('category');
    return hadiths;
};

const getHadithByDailyFromDB = async (daily: boolean): Promise<Ihadith[]> => {
    const hadiths = await Hadith.find({ daily }).sort({ createdAt: -1 }).populate('category');
    return hadiths;
};

const updateHadithToDB = async (id: string, payload: Partial<Ihadith>): Promise<Ihadith | null> => {
    const isExistHadith: any = await Hadith.findById(id);   
    if (!isExistHadith) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Hadith does not exist');
    }
    const updateHadith = await Hadith.findOneAndUpdate({ _id: id }, payload, { new: true });
    return updateHadith
    }

const deleteHadithFromDB = async (id: string): Promise<Ihadith | null> => {
    const isExistHadith = await Hadith.findByIdAndDelete(id);
    if (!isExistHadith) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Hadith');
    }
    return isExistHadith;
    };

const status = async (id: string): Promise<Ihadith | null> => {
    const hadith = await Hadith.findById(id);
    if (!hadith) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Hadith doesn't exist")
    }
    const updateHadith = await Hadith.findOneAndUpdate(
        { _id: id },
        { status: !hadith.status },
        { new: true }
    )
    return updateHadith
}



export const HadithService = {
    createHadithToDB,
    getAllHadithFromDB,
    getHadithByCategoryFromDB,
    getHadithByDailyFromDB,
    gethadithByIdFromDB,
    updateHadithToDB,
    deleteHadithFromDB,
    status
}