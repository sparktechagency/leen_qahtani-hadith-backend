import { model, Schema } from "mongoose";
import { IhadithModel, Ihadith } from "./hadith.interface";

 const HadithSchema = new Schema<Ihadith, IhadithModel>(
  {
    title : {
      type: String,
      required: false,
    },
    category: {
     type: Schema.Types.ObjectId,
            ref: "Category",
            required: false
    },
    daily: {
      type: Boolean,
      default: false,
    },
    hadith: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    refrence: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export const Hadith = model<Ihadith, IhadithModel>("Hadith", HadithSchema);
