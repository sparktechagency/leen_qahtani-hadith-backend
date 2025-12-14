import { Model, Types } from "mongoose";

export type IBookmark= {
    hadith: Types.ObjectId;
    user: Types.ObjectId;
}

export type BookmarkModel = Model<IBookmark>;