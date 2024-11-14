"use server"

import { signIn } from '@auth';
import * as z from 'zod';
import { LoginSchema } from '@schemas';
import { AuthError } from "next-auth";
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';
import argon2 from 'argon2';

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


export const verifyUser = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      return false;
    }

    console.log("verifyUser ------------------------------");
    console.log("email", email);
    console.log("password", password);
    console.log("verifyUser ------------------------------");
  
    const conn = await connection.getConnection();
  
    try {
        const [rows] = await conn.query<RowDataPacket[]>('SELECT password FROM user WHERE email = ?', [email]);
    
        if (rows.length === 0) {
            return false
        }

        const user = rows[0] as { password: string };
        const hashedPassword: string = user.password;

        console.log("hashedPassword", hashedPassword);

        // Step 2: Compare provided password with stored hashed password using argon2
        const isPasswordValid = await argon2.verify(hashedPassword, password);

        if (!isPasswordValid) {
            return false;
        }
    
        return true
    } catch (error) {
        console.error(error);
        return false
    } finally {
        conn.release();
    }
  }