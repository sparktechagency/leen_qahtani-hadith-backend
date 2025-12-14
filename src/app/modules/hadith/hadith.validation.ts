import { z } from 'zod'
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper'


const createHadithZodSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Title is required" }),
        category: objectIdZodSchema("Category is required"),
        description: z.string({ required_error: "Description is required" }),
        refrence: z.string({ required_error: "Refrence is required" }),
    })
}); 

const updateHadithZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        category: objectIdZodSchema("Category is required").optional(),
        description: z.string().optional(),
        refrence: z.string().optional(),
    })

})

export const HadithzodSchema = {
    createHadithZodSchema,
    updateHadithZodSchema
}
