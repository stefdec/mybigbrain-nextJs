"user server"
import {auth} from "@auth";
import { parseServerActionRepsonse } from "@lib/utils";
import { NextResponse } from 'next/server';
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';

import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    `${process.env.NEXT_BASE_URL}/api/auth/google/callback`
);

type Provider = {
  provider_id: number;
  provider_name: string;
  provider_logo: string;
};

type Process = {
  process_id: number;
  process_name: string;
  process_description: string;
  process_logo: string;
  is_user_linked: boolean;
};

export const getProcesses = async (providerId:string) => {
  // Placeholder for current user ID (replace this with actual user ID from session/auth)
  const conn = await connection.getConnection();
  const session = await auth(); // Change to dynamically fetch from your auth system
  if (!session) return parseServerActionRepsonse({error: "Not authenticated", status: 401})
  
  const currentUserId = session.user?.userId;

  try {
    // Step 1: Get all providers with id and name
    const [providers] =  await conn.query<Provider[] & RowDataPacket[]>('SELECT id as provider_id, name as provider_name, logo as provider_logo FROM provider WHERE id = ?', [providerId]);

    // Step 2: For each provider, fetch related processes and check user-process link for each process
    const providersData = await Promise.all(
      providers.map(async (provider) => {
        // Fetch processes linked to the current provider
        const [processes] = await conn.query<Process[] & RowDataPacket[]>(
          'SELECT id as process_id, name as process_name, description as process_description, logo as process_logo, scope as process_scope FROM process WHERE provider_id = ?',
          [provider.provider_id]
        );

        // For each process, check if the current user has a link in `user_process`
        const processesWithUserLink = await Promise.all(
          processes.map(async (process) => {
            const [userProcessLink] = await conn.query<{ is_linked: number }[] & RowDataPacket[]>(
              'SELECT EXISTS(SELECT 1 FROM user_process WHERE user_id = ? AND process_id = ?) AS is_linked',
              [currentUserId, process.process_id]
            );

            console.log(`userProcessLink: ${userProcessLink[0]?.is_linked}`);

            return {
              ...process,
              is_user_linked: userProcessLink[0]?.is_linked === 1, // true if link exists, false otherwise
            };
          })
        );

        return {
          ...provider,
          processes: processesWithUserLink,
        };
      })
    );

    return NextResponse.json(providersData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}

export const pullData = async (formData: FormData) => {
    const session = await auth()

    if (!session) return parseServerActionRepsonse({error: "Not authenticated", status: 401})
    
    const currentUserId = session.user?.userId;

    console.log(`currentUserId is ${currentUserId}`);

    console.log(formData.get('providerId'));
    console.log(formData.getAll('process'));

    const providerId = formData.get('providerId') as string;
    const scopes = formData.getAll('process').map(scope => scope.toString());
    //Add profile info scope
    scopes.push('https://www.googleapis.com/auth/userinfo.email');

    const stateObject = {
        user_id: currentUserId,
        provider_id: providerId,
        scopes: scopes
    };

    console.log(stateObject);
    // Generate the Google OAuth URL with dynamic scopes
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'offline' to get a refresh token
      scope: scopes, // Use the scopes provided in the request
      prompt: 'consent', // Force consent screen every time
      state: JSON.stringify(stateObject), // Attach user_id and provider_id to state to identify them later in the callback
    });

    //return the url to the client
    return url;
}

export const saveTokens = async (userId: string, providerId: string, encryptedAccessToken: string, encryptedRefreshToken: string) => {
  const conn = await connection.getConnection();
  try {
    const query = `
        INSERT INTO user_tokens (user_id, provider_id, access_token, refresh_token)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        access_token = VALUES(access_token),
        refresh_token = VALUES(refresh_token);
        `;
    
    await conn.query(query, [userId, providerId, encryptedAccessToken, encryptedRefreshToken]);
    return true;
  } catch (error) {
      console.error('Error saving tokens:', error);
      return false;
  } finally {
    conn.release();
  }
}