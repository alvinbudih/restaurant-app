import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username must have at least 1 character"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Email must be a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(5, "Password must have at least 5 characters"),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, "Role must have at least 1 character"),
  phoneNumber: z
    .string()
    .min(8, "Phone number must have at least 8 characters")
    .optional(),
  address: z.string().optional(),
});

export type RegisterPayload = z.infer<typeof userSchema>;

export const loginSchema = userSchema.pick({ email: true, password: true });

export type LoginPayload = z.infer<typeof loginSchema>;
