import { z } from "zod"

export const profileSchema = z.object({
    name: z
        .string()
        .min(1, "Name cannot be empty")
        .regex(/^[a-zA-Z\s]+$/, "Name contain Only Letters"),
    email: z
        .string()
        .email("Invalid Email")
})