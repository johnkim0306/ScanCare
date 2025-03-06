// lib/meldrxAuth.ts
const clientId = process.env.MELDRX_CLIENT_ID;
const clientSecret = process.env.MELDRX_CLIENT_SECRET;
const meldrxTokenUrl = process.env.MELDRX_TOKEN_URL;

export async function getAccessToken(code: string, codeVerifier: string) {
  try {
    const response = await fetch(meldrxTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'http://localhost:3000/api/callback', // Match the registered redirect_uri
        code: code,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve access token: ${response.statusText}`);
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    throw error;
  }
}