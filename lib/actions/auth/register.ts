"use server"
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';
import * as z from 'zod';
import { RegisterSchema } from '@schemas';
import { NextResponse } from 'next/server';

type User = {
    id: number;
    userId: number;
    name: string;
    email: string;
    picture: string;
    lastName: string;
    bio: string;
  };

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
        conn.release();
        return {success: "User registered successfully"};
    } catch (error) {
        console.error(error);
        return {error: "Something went wrong..."};
    } finally {
        conn.release();
        return {success: "User registered successfully"};
    }
};

export const registerUserFromProvider = async (user: User) => {
    if (!await _verifiyIfUserExists(user.email)) {
        const conn = await connection.getConnection();
  
        try {
            const result = await conn.query<ResultSetHeader>('INSERT INTO user (first_name, email, profile_pic) VALUES (?, ?, ?, ?, ?)', [user.name, user.email, user.picture]);
            //get the id of the newly created user
            const userId = result[0].insertId;
            conn.release();
            return NextResponse.json({ userId });
        } catch (error) {
            console.error(error);
        } finally {
            conn.release();
        }
    }
}

// async function _hashPassword(password: string): Promise<string> {
//     bcrypt.genSalt(10, function(saltError: Error | undefined, salt: string) {
//         if (saltError) {
//             console.error(saltError);
//             return '';
//         }
//         bcrypt.hash(password, salt, function(saltError: Error | undefined, hash: string) {
//             if (saltError) {
//                 console.error(saltError);
//                 return '';
//             }
//             return hash;
//         });
//     });
//     return '';
// }
    

async function _verifiyIfUserExists(email: string): Promise<boolean> {
    const conn = await connection.getConnection();
  
    try {
      const [rows] = await conn.query<User[] & RowDataPacket[]>('SELECT id FROM user WHERE email = ?', [email]);
  
      if (rows.length > 0) {
        conn.release();
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