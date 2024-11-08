import { NextResponse } from 'next/server';
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';

import crypto from 'crypto';

type UserTokens = {
  access_token: string;
  refresh_token: string;
};


// Encrypt a token using the AES key
function encryptTokenWithAES(aesKey: Buffer, token: string): { ciphertext: string; iv: string } {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(token, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return {
    ciphertext: encrypted,
    iv: iv.toString('base64')
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const providerId = url.searchParams.get('providerId');
  const authorizationHeader = req.headers.get('Authorization');

  const api_key = `Bearer ${process.env.BP_PHOTO_API_KEY}`;

  if (!authorizationHeader) {
    return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
  }

  if (authorizationHeader !== api_key) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  

  if (!userId || !providerId) {
    return NextResponse.json({ error: 'Paramters are required' }, { status: 400 });
  }

  //add more security checks on userId and providerId
  //Check that userId and providerId are numeric
  if (isNaN(Number(userId)) || isNaN(Number(providerId))) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const conn = await connection.getConnection();

  try {
    const [rows] = await conn.query<UserTokens[] & RowDataPacket[]>('SELECT access_token, refresh_token FROM user_tokens WHERE user_id = ? AND provider_id=?', [userId, providerId]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const accessToken = rows[0].access_token;
    const refreshToken = rows[0].refresh_token;

    //Return the encrypted AES key, encrypted access token, and encrypted refresh token
    return NextResponse.json({ access_token: accessToken, refresh_token: refreshToken });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}