"use server"
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';
import * as z from 'zod';
import { RegisterSchema } from '@schemas';
import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import { signIn } from '@auth';
import { User } from '@schemas/user';

export const registerUser = async (values:z.infer<typeof RegisterSchema>) => {
    //Validate the fields
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }

    const firstName = values.firstName;
    const lastName = values.lastName;
    const email = values.email;
    const password = values.password

    //Check if the user already exists
    if (await _verifiyIfUserExists(email)) {
        return {error: "This email is already registered, go to login page"};
    }

    //Hash the password
    const hashedPassword = await _hashPassword(password);

    //Register the user
    const conn = await connection.getConnection();

    try {
        await conn.query('INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hashedPassword]);
        console.log("User registered successfully");

        //Now we log the user in and create the session
        await signIn("credentials", {
            redirect: false,
            callbackUrl: "/chatbot",
            email,
            password,
        });

        return {success: "User registered successfully"};
    } catch (error) {
        console.error(error);
        return {error: "Something went wrong..."};
    } finally {
        conn.release();
    }
};

export const registerUserFromProvider = async (user: User) => {
    if (!await _verifiyIfUserExists(user.email)) {
        const conn = await connection.getConnection();
  
        try {
            const result = await conn.query<ResultSetHeader>('INSERT INTO user (first_name, email, profile_pic) VALUES (?, ?, ?, ?, ?)', [user.name, user.email, user.picture]);
            //get the id of the newly created user
            const userId = result[0].insertId;
            return NextResponse.json({ userId });
        } catch (error) {
            console.error(error);
        } finally {
            conn.release();
        }
    }
}

async function _hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2**16,
            timeCost: 5,
            parallelism: 2
        });
        return hashedPassword;
    } catch (error) {
        console.error(error);
    }
    return '';
}
    

async function _verifiyIfUserExists(email: string): Promise<boolean> {
    const conn = await connection.getConnection();
  
    try {
      const [rows] = await conn.query<User[] & RowDataPacket[]>('SELECT id FROM user WHERE email = ?', [email]);
  
      if (rows.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      conn.release();
    }
  }