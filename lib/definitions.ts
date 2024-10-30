import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required"})
    .min(5, "Email is too short")
    .email("Please enter a valid email"),
  password: string({ required_error: "Password is required"})
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters long")
});

export const signUpSchema = object({
  firstName: string({ required_error: "First name is required"})
    .min(1, "First name is too short")
    .max(32, "First name is too long"),
  lastName: string({ required_error: "Last name is required"})
    .min(1, "Last name is too short")
    .max(32, "Last name is too long"),
  email: string({ required_error: "Email is required"})
    .min(5, "Email is too short")
    .email("Please enter a valid email"),
  password: string({ required_error: "Password is required"})
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters long")
});

export type FormState =
  | {
      errors?: {
        firstName?: string[]
        lastName?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined