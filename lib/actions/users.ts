"user server";
import connection from '@config/db';
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';
import { User } from '@schemas/user';


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