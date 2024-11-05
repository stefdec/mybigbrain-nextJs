import { NextResponse } from 'next/server';
import connection from '@config/db';

export async function GET(req: Request, context: { params: Promise<{ email: string, password:string }> }) {
  const { email, password } = await context.params; 

  if (!email || !password) {
    return NextResponse.json({ error: 'Email & password are required' }, { status: 400 });
  }

  if(typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email & password must be strings' }, { status: 400 });
  }

  const conn = await connection.getConnection();

  try {
    const [rows]: [any[], any] = await conn.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Authentification failed' }, { status: 403 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}