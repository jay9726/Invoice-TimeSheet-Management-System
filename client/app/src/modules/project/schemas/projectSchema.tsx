import z from "zod"


export const projectSchema = z.object({
    projectName: z.string().nonempty("Enter Project Name").min(2, "Project Name must be at least 2 characters").max(120, "Project Name must be at most 120 characters."),
    paymentTerms: z.string().nonempty("Enter Payment Terms").min(2, "Payment Terms must be at least 2 characters").max(120, "Payment Terms must be at most 120 characters."),
    clientId: z.string().nonempty("Select Client").min(1, "Client  is required."),
    hourlyRate: z.string().nonempty("Enter Hourly Rate").min(1, "Hourly Rate is required.").regex(/^\d+(\.\d+)?$/, "Hourly Rate must be a number").refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Hourly Rate must be a positive number."),
    isActive: z.boolean().optional(),
})


export type projectPayload = z.infer<typeof projectSchema>
