// app/api/process-patient/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Step 1: Fetch patient data
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const patientId = 'c0c8cf97-79ad-4986-8bd0-70d9ac8e8c5b';
    const fhirUrl = `https://app.meldrx.com/api/fhir/d1fe174c-d2f1-42ea-affd-5c2aca69a57e/Patient/${patientId}`;

    const patientResponse = await fetch(fhirUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!patientResponse.ok) {
      throw new Error(`Failed to fetch patient data: ${patientResponse.statusText}`);
    }

    const patientData = await patientResponse.json();

    // Step 2: Pass patient data to Gemini
    const geminiResponse = await fetch('https://api.gemini.com/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ patientData }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Failed to process data with Gemini: ${geminiResponse.statusText}`);
    }

    const geminiResult = await geminiResponse.json();

    // Return the result from Gemini
    return NextResponse.json({ geminiResult });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}