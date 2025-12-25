import { z } from "zod"
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email cannot be empty")
        .email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be min 8 character")
})
export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be minimun 3 character"),
    email: z
        .string()
        .min(1, "Email cannot be empty")
        .email("Invalid email address"),
    password: z
        .string()
        .trim()
        .min(8, "Password must be minimum 8 character")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z
        .string()
        .min(1, "Minimum password is Required")
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"]
    })

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>