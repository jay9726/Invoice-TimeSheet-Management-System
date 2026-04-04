import { passwordSchema } from "@/modules/auth/schemas/authSchema"
import { z } from "zod"

export const userRoles = ["ADMIN", "ACCOUNTUSER", "EMPLOYEE", "MANAGER"]




export const userSchema = z.object({
    fullName: z.string().nonempty("Enter your name").min(2, "Your name must be at least 2 characters").max(80, "Your name must be at most 80 characters."),
    email: z.string().nonempty("Enter your email").min(1, "Email is required.").email("Enter a valid email address."),
    password: passwordSchema,
    role: z.string().nonempty("Select a role").min(1, "Role is required."),
    isActive: z.boolean(),
})

export const updateUserSchema = z.object({
    fullName: z.string().nonempty("Enter your name").min(2, "Your name must be at least 2 characters").max(80, "Your name must be at most 80 characters."),
    email: z.string().nonempty("Enter your email").min(1, "Email is required.").email("Enter a valid email address."),
    role: z.string().nonempty("Select a role").min(1, "Role is required."),
})



export type userPayload = z.infer<typeof userSchema>
export type updateUserPayload = z.infer<typeof updateUserSchema>


