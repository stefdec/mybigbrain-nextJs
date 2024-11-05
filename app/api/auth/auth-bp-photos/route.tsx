import { NextResponse } from 'next/server';
import connection from '@config/db';

import crypto from 'crypto';
import forge from 'node-forge';

import { decryptToken } from '@lib/token_mgmt';

// Generate a new AES key
function generateAESKey(): Buffer {
  return crypto.randomBytes(32); // 256-bit key
}

// Encrypt the AES key using RSA public key
function encryptAESKeyWithRSA(aesKey: Buffer): string {
  const publicKey = process.env.BP_PHOTO_TOKEN_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('Public key is not defined');
  }
  const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
  const encryptedKey = publicKeyForge.encrypt(aesKey.toString('binary'), 'RSA-OAEP');
  return forge.util.encode64(encryptedKey);
}

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
    const [rows]: [any[], any] = await conn.query('SELECT access_token, refresh_token FROM user_tokens WHERE user_id = ? AND provider_id=?', [userId, providerId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const accessToken = rows[0].access_token;
    const refreshToken = rows[0].refresh_token;

    // Decrypt the access token using the AES key
    const decryptedAccessToken = await decryptToken(accessToken);

    if (!decryptedAccessToken) {
      return NextResponse.json({ error: 'Failed to decrypt access token' }, { status: 500 });
    }

    // Decrypt the refresh token using the AES key
    const decryptedRefreshToken = await decryptToken(refreshToken);

    if (!decryptedRefreshToken) {
      return NextResponse.json({ error: 'Failed to decrypt refresh token' }, { status: 500 });
    }

    //Generate a new AES key
    const aesKey = generateAESKey();

    //Encrypt the AES key using RSA public key
    const encryptedAESKey = encryptAESKeyWithRSA(aesKey);

    //Encrypt the access token using the AES key
    const encryptedAccessToken = encryptTokenWithAES(aesKey, decryptedAccessToken);

    //Encrypt the refresh token using the AES key
    const encryptedRefreshToken = encryptTokenWithAES(aesKey, decryptedRefreshToken);

    //Return the encrypted AES key, encrypted access token, and encrypted refresh token
    return NextResponse.json({ aes_key: encryptedAESKey, access_token: encryptedAccessToken, refresh_token: encryptedRefreshToken });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}