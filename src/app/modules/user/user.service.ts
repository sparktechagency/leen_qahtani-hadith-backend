import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";
import { Reservation } from "../reservation/reservation.model";

import { sendTwilioOTP } from "../../../helpers/twillo";
import { formatPhoneNumber } from "../../../helpers/formatedPhoneNumber";
import { AppError } from "../../../errors/error.app";
import { UpdateQuery } from "mongoose";

const createAdminToDB = async (payload: any): Promise<IUser> => {

  // check admin is exist or not;
  const isExistAdmin = await User.findOne({ email: payload.email })
  if (isExistAdmin) {
    throw new ApiError(StatusCodes.CONFLICT, "This Email already taken");
  }

  // create admin to db
  const createAdmin = await User.create(payload);
  if (!createAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
  } else {
    await User.findByIdAndUpdate({ _id: createAdmin?._id }, { verified: true }, { new: true });
  }

  return createAdmin;
}

const storeAppIdToDB = async (payload: any): Promise<void> => {
  const { appId } = payload;
  const isExistAppId = await User.findOne({ appId: appId });
  if (isExistAppId) {
    return;
  }
  await User.create({ appId: appId });
};

const getallappIdToDB = async (): Promise<IUser[]> => {
  const allAppIds = await User.find({ appId: { $exists: true } }).lean();
  if (!allAppIds) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No appIds found");
  }
  return allAppIds;
};

const appIdsStatisticsToDB = async () => {
  const currentYear = new Date().getFullYear();
  const statistics = [];

  const fullYearTotal = await User.countDocuments({
    appId: { $exists: true },
    createdAt: {
      $gte: new Date(currentYear, 0, 1),
      $lt: new Date(currentYear + 1, 0, 1),
    },
  });

  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(currentYear, month, 1);
    const monthEnd = new Date(currentYear, month + 1, 1);

    const monthlyCount = await User.countDocuments({
      appId: { $exists: true },
      createdAt: { $gte: monthStart, $lt: monthEnd },
    });

    const yearToDateTotal = await User.countDocuments({
      appId: { $exists: true },
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: monthEnd,
      },
    });

    statistics.push({
      month: month + 1,
      monthlyCount,
      yearToDateTotal,
      fullYearTotal,
    });
  }

  return {
    year: currentYear,
    statistics,
  };
};

const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser: any = await User.findById(id).lean();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const holderStatus = await User.findOne({
    _id: id,
    role: { $in: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER] }
  });

  const data = {
    ...isExistUser,
    hold: !!holderStatus,
  }

  return data;
};

const updateProfileToDB = async (user: { id: any; }, payload: UpdateQuery<IUser> | undefined) => {
    const existingUser = await User.findById(user.id);

    if (!existingUser) {
        throw new ApiError(400, "User not found");
    }

    if (payload && payload.profile && existingUser.profile) {
        unlinkFile(existingUser.profile);
    }

    const updated = await User.findByIdAndUpdate(
        user.id,
        payload,
        { new: true, runValidators: true }
    );

    return updated;
};

const updateLocationToDB = async (user: JwtPayload, payload: { longitude: number; latitude: number }): Promise<IUser | null> => {

  const result = await User.findByIdAndUpdate(
    user.id,
    {
      $set: {
        "location.type": "Point",
        "location.coordinates": [payload.longitude, payload.latitude]
      }
    },
    { new: true }
  );

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Failed to update user location");
  }

  return result;
};

export const UserService = {
  storeAppIdToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  createAdminToDB,
  updateLocationToDB,
  getallappIdToDB,
  appIdsStatisticsToDB,
};