import z from "zod"


export const bankDetailSchema = z.object({
    companyId: z.string().nonempty("Select a company").min(1, "Company is required."),
    bankName: z.string().nonempty("Enter a bank name").min(2, "Bank Name must be at least 2 characters.").max(100, "Bank Name must be at most 100 characters."),
    swiftCode: z.string().nonempty("Enter a swift code").min(4, "Swift Code must be at least 4 characters.").max(4, "Swift Code must be 4 characters.").regex(/^[0-9]+$/, "Swift Code must be alphanumeric."),
    accountName: z.string().nonempty("Enter an account name").min(2, "Account Name must be at least 2 characters.").max(100, "Account Name must be at most 100 characters.").regex(/^[A-Za-z]+$/, "Account name must be alphanumeric."),
    accountNumber: z.string().nonempty("Enter an account number").min(10, "Account Number must be at least 10 digits.").max(14, "Account Number must be at most 14 digits.").regex(/^[0-9]+$/, "Account Number must contain digits only."),
    routingNumber: z.string().nonempty("Enter a routing number").min(9, "Routing Number must be at least 9 digits.").max(9, "Routing Number must 9 digits.").regex(/^[0-9]+$/, "Routing Number must contain digits only."),
    isActive: z.boolean().default(true),
})


export type bankDetailPayload = z.infer<typeof bankDetailSchema>
