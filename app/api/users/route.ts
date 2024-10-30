// app/api/users/route.ts

import { NextResponse } from 'next/server';
import connection from '@config/db';

export async function GET() {
  try {
    const [rows]: [any[], any] = await connection.query('SELECT * FROM user');

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  }
}
