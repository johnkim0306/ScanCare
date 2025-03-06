// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Extract the authorization code from the query parameters
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      throw new Error('Authorization code is missing');
    }

    // Retrieve the code verifier (stored earlier during the authorization request)
    const codeVerifier = 'nia9o0x368je5l1i5u6ndcgickxplcp8bejhssh8j9ypcg7itmuaec6iqxpd5blcxdp3votn5wwn03zgnnnoskajlwfnvfu76xq84id71noauna3543jsnc6rill0roo';

    // Make a POST request to the token endpoint
    const tokenUrl = 'https://app.meldrx.com/connect/token';
    const clientId = process.env.MELDRX_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/api/callback';

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve access token: ${response.statusText}`);
    }

    const tokenData = await response.json();
    return NextResponse.json({ tokenData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}