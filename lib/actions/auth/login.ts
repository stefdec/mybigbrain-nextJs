"use server"

import { signIn } from '@auth';
import * as z from 'zod';
import { LoginSchema } from '@schemas';
import { error } from 'console';
import { CredentialsSignin } from "next-auth";
import { AuthError } from "next-auth";

export const login = async (values:z.infer<typeof LoginSchema>)=>{
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }

    const email = values.email;
    const password = values.password;

    try {
        await signIn("credentials", {
          redirect: false,
          callbackUrl: "/chatbot",
          email,
          password,
        });
    
    
      }catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!!!!!!" , status: "error"};
                case "CredentialsSignin":
                    throw error;
                default:
                    return { error: "Something went wrong", status: "error" };
            }
          }
      }

    return { success: "Login successful" };
}