import { NextResponse } from 'next/server';
import connection from '@config/db';

export async function GET(req: Request, context: { params: { email: string } }) {
  const { email } = await context.params; // Await the params object

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const [rows]: [any[], any] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  }
}