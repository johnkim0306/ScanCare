// app/api/auth/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.MELDRX_CLIENT_ID;
  const MELDRX_WS_URL = process.env.MELDRX_WS_URL;
  const redirectUri = 'http://localhost:3000/api/callback'; // Match the registered redirect_uri
  const codeChallenge = '6QefNPsAxzaVmFf-rPCWdDzizSqfi3300QCOnRRKRtA'; // Generate this dynamically
  const scope = 'patient/*.read launch/patient'; // Adjust scopes as needed

  const authUrl = `https://app.meldrx.com/connect/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  const authUrl2 = `https://app.meldrx.com/connect/authorize?client_id=${clientId}&aud=${MELDRX_WS_URL}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`;


  // Redirect the user to the MeldRx authorization endpoint
  return NextResponse.redirect(authUrl2);
}


//{{meldrx_base_url}}/connect/authorize?client_id={{user_app_client_id}}&aud={{meldrx_ws_url}}&redirect_uri={{user_app_redirect_uri}}&scope={{user_app_scopes}}&response_type=code&code_challenge={{code_challenge}}&code_challenge_method=S256