import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IBookmark } from "./bookmark.interface";
import { Bookmark } from "./bookmark.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";


const toggleBookmark = async (payload: { hadith: string }): Promise<string> => {

    if (!mongoose.Types.ObjectId.isValid(payload.hadith)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Invalid Hadith ID")
    }

    const existingBookmark = await Bookmark.findOne(payload);

    if (existingBookmark) {
        await Bookmark.findByIdAndDelete(existingBookmark._id);
        return "Bookmark Remove successfully";
    } else {

        const result = await Bookmark.create(payload);
        if (!result) {
            throw new ApiError(StatusCodes.EXPECTATION_FAILED, "Failed to add bookmark");
        }
        return "Bookmark Added successfully";
    }
};


const getBookmark = async (user: JwtPayload, query: Record<string, any>): Promise<IBookmark[]> => {
    const searchQuery: any = { user: user.id };
    const hadith = await Bookmark.find({ hadith: { $exists: true } })
        .populate([
            {
                path: "hadith",
                select: "title category description refrence icon daily",
            },
        ])
        .select("hadith")
        .lean();

    const hadithBookmark = await Promise.all(hadith.map(async (hadith: any) => {

        return {
            ... hadith,
       
            isBookmarked: true
        };
    }));

    return hadithBookmark;
}

export const BookmarkService = { toggleBookmark, getBookmark }