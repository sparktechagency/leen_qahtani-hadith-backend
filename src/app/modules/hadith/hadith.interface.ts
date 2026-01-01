import { Model, Types } from "mongoose";
import { ServiceType } from "../../../enums/serviceType";
export interface Ihadith {
    title: string;
    category: Types.ObjectId;
    hadith: string;
    description: string;
    daily: boolean;
    refrence: string;
    icon?: string;
    status?: boolean;
};
export type IhadithModel = Model<Ihadith>;