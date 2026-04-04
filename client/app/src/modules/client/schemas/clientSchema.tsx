import z from "zod";
import { pincodeSchema } from "@/modules/company/schemas/companySchema";


export const clientSchema = z.object({
    clientName: z.string().nonempty("Enter Client Name").min(2, "Client Name must be at least 2 characters"),
    contactNumber: z.string().nonempty("Enter Contact Number").min(10, "Contact Number Must Be 10 Digits.").max(10, "Contact Number Must Be 10 Digits."),
    companyId: z.string().nonempty("Select Company").min(1, "Company is Required"),
    addressLine1: z.string().nonempty("Enter Address").min(3, "Address must be at least 3 characters"),
    country: z.string().nonempty("Select Country").min(1, "Country is required."),
    state: z.string().nonempty("Select State").min(1, "State is required."),
    city: z.string().nonempty("Select City").min(1, "City is required."),
    zip: pincodeSchema,
    isActive: z.boolean().optional()
})

export type clientPayload = z.infer<typeof clientSchema>;