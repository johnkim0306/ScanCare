// app/api/patient-documents/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Extract the access token from the query parameters or headers
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    // Use the patient ID from the token response
    const patientId = 'c0c8cf97-79ad-4986-8bd0-70d9ac8e8c5b';

    // Construct the FHIR API URL for DocumentReference
    const fhirUrl = `https://app.meldrx.com/api/fhir/d1fe174c-d2f1-42ea-affd-5c2aca69a57e/DocumentReference?patient=${patientId}`;

    // Fetch documents using the access token
    const response = await fetch(fhirUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    const documents = await response.json();
    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}