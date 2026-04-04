import z from "zod";

export const invoiceSchema = z.object({
    invoiceDecision: z.string().min(1, "Select Decision"),
});

export type invoicePayload = z.infer<typeof invoiceSchema>
