import { z } from "zod";

export const managerDecisionSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().min(2, "Comment required").max(300, "Max 300 chars"),
});

export type managerDecisionPayload = z.infer<typeof managerDecisionSchema>;

