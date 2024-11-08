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