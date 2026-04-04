import z from "zod";


export const taskActivitySchema = z.object({
  workDate: z.string().min(1, "Work date is required"),
  clientId: z.string().nonempty("Select a client").min(1, "Client is required"),
  projectId: z.string().nonempty("Select a project").min(1, "Project is required"),
  taskActivityName: z.string().nonempty("Enter a task/activity").min(2, "Task/Activity must be at least 2 characters"),
  startTime: z.string().nonempty("Provide Start & End time"),
  endTime: z.string().nonempty("Provide Start & End time"),
  hoursWorked: z.number().min(0.01, "Hours must be greater than 0.01"),
  isBillable: z.boolean(),
  notes: z.string().nonempty("Enter a notes").min(2, "Notes must be at least 2 characters"),
  clientName: z.string().optional(),
  projectName: z.string().optional(),
})




export type taskActivityPayload = z.infer<typeof taskActivitySchema>

