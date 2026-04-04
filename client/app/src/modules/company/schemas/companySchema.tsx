import z from "zod";

export const pincodeSchema = z
    .string()
    .nonempty("Enter Pincode")
    .min(5, "Pincode must be grather than 5 digits")
    .max(6, "Pincode must be less then 6 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers");


export const companySchema = z.object({
    companyName: z.string().nonempty("Enter Company Name ").min(2, "Company Name must be at least 2 characters"),
    addressLine1: z.string().nonempty("Enter Address").min(3, "Address must be greater then 3 characters"),
    country: z.string().min(2, "Country Required"),
    state: z.string().min(2, "State Required"),
    city: z.string().min(2, "City Required"),
    zip: pincodeSchema,
    isActive: z.boolean(),
    logoFile: z.any().optional()
})

export type companySchemaPayload = z.infer<typeof companySchema>;