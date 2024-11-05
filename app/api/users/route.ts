// app/api/users/route.ts

import { NextResponse } from 'next/server';
import connection from '@config/db';

export async function GET() {
  const conn = await connection.getConnection();
  try {
    const [rows]: [any[], any] = await conn.query('SELECT * FROM user');

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
