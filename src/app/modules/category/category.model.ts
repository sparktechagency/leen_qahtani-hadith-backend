import { model, Schema } from 'mongoose'
import { ICategory, CategoryModel } from './category.interface'

const serviceSchema = new Schema<ICategory, CategoryModel>(
    {
        name: {
            type: String,
            required: false,
            unique: true
        },
        image: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            default:true
        }
    },
    { timestamps: true },
)

export const Category = model<ICategory, CategoryModel>('Category', serviceSchema)