"user server";
import connection from '@config/db';
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';
import { signIn } from '@auth';
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { ResultSetHeader } from 'mysql2/promise';

type User = {
  id: number;
  userId: number;
  name: string;
  email: string;
  picture: string;
  lastName: string;
  bio: string;
};

export const login = async (formData: FormData) => {
  console.log("PRINT formData", formData);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/chatbot",
      email,
      password,
    });

    console.log("PRINT result", result.user);

  }catch (error) {
    console.error("Unexpected error during authorization'", error);
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  return "/chatbot";
};

export const registerUser = async (formData: FormData) => {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ error: 'First name, last name, email, and password are required' }, { status: 400 });
    }

    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return NextResponse.json({ error: 'First name, last name, email, and password must be strings' }, { status: 400 });
    }

    console.log("PRINT formData", formData);
    if (await verifiyIfUserExists(email)) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    //Register the user
    const conn = await connection.getConnection();

    try {
        await conn.query('INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database query error' }, { status: 500 });
    } finally {
        conn.release();
    }
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 200 });

};

export const registerUserFromProvider = async (user: User) => {
  if (await verifiyIfUserExists(user.email)) {
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
  }

  const conn = await connection.getConnection();

  try {
    const result = await conn.query<ResultSetHeader>('INSERT INTO user (first_name, email, profile_pic) VALUES (?, ?, ?, ?, ?)', [user.name, user.email, user.picture]);
    //get the id of the newly created user
    const userId = result[0].insertId;
    return NextResponse.json({ userId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }

  return NextResponse.json({ error: 'User with this email already exists' }, { status: 200 });
}

async function verifiyIfUserExists(email: string): Promise<boolean> {
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

  return true;
}

export const verifyUser = async (email: string, password: string) => {
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const conn = await connection.getConnection();

  try {
    const [rows] = await conn.query<User[] & RowDataPacket[]>('SELECT id, first_name, last_name, email, profile_pic, bio FROM user WHERE email = ? AND password = ?', [email, password]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}

export const getUserProfile = async (email: string) => {

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const conn = await connection.getConnection();

  try {
    const [rows] = await conn.query<User[] & RowDataPacket[]>('SELECT id, first_name, last_name, email, profile_pic, bio FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}