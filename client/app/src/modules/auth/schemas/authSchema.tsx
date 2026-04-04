import z from "zod";

export const passwordSchema = z.string()
  .nonempty("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password is too long")
  .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
  .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
  .regex(/[0-9]/, "Must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character")

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
  password: passwordSchema,
});


export const forgotPasswordSchema = z.object({
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
})



export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password is too long")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((val) => val.newPassword === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })


export type loginPayload = z.infer<typeof loginSchema>;
export type forgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type resetPasswordPayload = z.infer<typeof resetPasswordSchema>
