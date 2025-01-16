import {NextRequest, NextResponse } from 'next/server';
import { encryptToken } from '@lib/actions/tokens/token_mgmt';
import { saveTokens } from '@lib/actions/apis/api-processes';
import { saveAndPullGoogle } from '@lib/actions/google/google_actions';

import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/googleApis/callback`
);

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');  
    const stateString = searchParams.get('state');
    const state = stateString ? JSON.parse(stateString) : null;

    //console.log('code:', code);
    //console.log('state:', state);

    if(!code) return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?oAuthError=1`);

    try {
        // Exchange authorization code for access and refresh tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Extract access_token and refresh_token
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;

        console.log('accessToken:', accessToken);
        console.log('refreshToken:', refreshToken);

        if (!accessToken || !refreshToken) {
            throw new Error('Failed to retrieve tokens. Access or Refresh token is missing.');
        }

        // Encrypt the tokens
        const encryptedAccessToken = await encryptToken(accessToken);
        const encryptedRefreshToken = await encryptToken(refreshToken);

        // Get user_id and provider_id from state
        if (!state) {
            throw new Error('State parameter is missing.');
        }

        const userId = state?.user_id;
        const providerId = state?.provider_id;
        const scopes = state?.scopes;

        if (!userId || !providerId) {
            throw new Error('User or Provider ID is missing.');
        }

        if (!encryptedAccessToken || !encryptedRefreshToken) {
            throw new Error('Failed to encrypt tokens.');
        }

        const save_tokens = await saveTokens(userId.toString(), providerId.toString(), encryptedAccessToken, encryptedRefreshToken);
        if (!save_tokens) {
            NextResponse.json({ error: 'Failed to save tokens in DB' }, { status: 500 });
        }

        // Save scopes in DB & Start data pull for each process asynchronously
        if (scopes) {
            saveAndPullGoogle(userId, providerId, scopes, accessToken, refreshToken)
                .catch(err => console.error('Error in saveAndPullGoogle:', err));
        }

        // Redirect to a success page
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/apps`);

        //return NextResponse.json({ accessToken, refreshToken, encryptedAccessToken, encryptedRefreshToken });

    } catch (error) {
        console.error('Error during Google authentication callback:', error);
        //res.status(500).json({ error: 'Failed to authenticate with Google', details: error.message });
        NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?oAuthError=1`)
    }
  
}