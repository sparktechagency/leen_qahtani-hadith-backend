import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { Reservation } from '../reservation/reservation.model';
import QueryBuilder from '../../../shared/apiFeature';

const createAdminToDB = async (payload: IUser): Promise<IUser> => {
    const createAdmin: any = await User.create(payload);
    if (!createAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    if (createAdmin) {
        await User.findByIdAndUpdate(
            { _id: createAdmin?._id },
            { verified: true },
            { new: true }
        );
    }
    return createAdmin;
};

const deleteAdminFromDB = async (id: any): Promise<IUser | undefined> => {
    const isExistAdmin = await User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
    }
    return;
};

const getAdminFromDB = async (): Promise<IUser[]> => {
    const admins = await User.find({ role: 'ADMIN' })
        .select('name email profile contact location');
    return admins;
};

const countSummaryFromDB = async () => {


    const totaluser = await User.countDocuments({
        $and: [
            { role: { $nin: ["SUPER-ADMIN", "ADMIN"] } },
            { role: "USER" }
        ]
    });



    return {
        totaluser
    };

}

const userStatisticsFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const userStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        users: 0,
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const usersAnalytics = await User.aggregate([
        {
            $match: {
                role: { $in: ["USER"] },
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    role: "$role",
                },
                total: { $sum: 1 }
            }
        }
    ]);

    // Populate statistics array
    usersAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1; 
        
         if (stat._id.role === "USER") {
            userStatisticsArray[monthIndex].users = stat.total;
        }
    });

    return userStatisticsArray;
};

export const AdminService = {
    createAdminToDB,
    deleteAdminFromDB,
    getAdminFromDB,
    countSummaryFromDB,
    userStatisticsFromDB,
};
