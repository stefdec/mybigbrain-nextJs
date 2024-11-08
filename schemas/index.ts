import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(1, {
        message: 'Password is required'
    }),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters'
    }),
    firstName: z.string().min(1, {
        message: 'First name is required'
    }),
    lastName: z.string().min(1, {
        message: 'Last name is required'
    }),
})