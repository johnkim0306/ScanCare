import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { promisify } from 'util';
import { redis } from "@/lib/redis";
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import fetch from 'node-fetch';

const PROJECT_ID = "nofoodwaste-448015";
const location = 'us-central1';
const VISION_MODEL = "gemini-1.0-pro-vision-001";

const vertexAI = new VertexAI({ project: PROJECT_ID, location: location });

const generativeVisionModel = vertexAI.getGenerativeModel({
  model: VISION_MODEL,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.4,
    topP: 0.4,
    topK: 32,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

const prompt = `
  Analyze this medical image (X-ray/CT scan/MRI) to identify any abnormalities, conditions, or early signs of potential health issues. 
  Provide a detailed report of your findings in an array of objects format, including:
    1. The condition identified (in lowercase).
    2. A detailed description of the condition.
    3. A confidence score (0-100) indicating the likelihood of the condition.
    4. Actionable recommendations for preventive care or next steps (e.g., follow-up tests, treatments, lifestyle changes).

  Use this example as context: 
  [
    {
      "condition": "fracture",
      "description": "A fracture in the left femur",
      "confidence": 95,
      "recommendations": [
        "Refer to an orthopedic specialist for further evaluation.",
        "Schedule a follow-up X-ray in 4 weeks to monitor healing."
      ]
    },
    {
      "condition": "pneumonia",
      "description": "Signs of pneumonia in the right lung",
      "confidence": 85,
      "recommendations": [
        "Prescribe antibiotics based on clinical guidelines.",
        "Monitor oxygen saturation levels and consider hospitalization if symptoms worsen."
      ]
    }
  ]

  If no abnormalities are found, return -1.
`;

const readFile = promisify(fs.readFile);

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle file uploads
  },
};

// Rate Limit Configuration
const MAX_REQUESTS = 1;
const WINDOW_SECONDS = 60; 

async function isRateLimited(ip: string): Promise<boolean> {
  const cacheKey = `rate-limit:${ip}`;
  const requests = await redis.incr(cacheKey);

  console.log(`IP ${ip} has made ${requests} requests`); // Debugging Log

  if (requests === 1) {
    await redis.expire(cacheKey, WINDOW_SECONDS); // Expire the key after 60 seconds
  }

  return requests > MAX_REQUESTS;
}

// Function to fetch patient data from MeldRx
async function fetchPatientData(patientId: string) {
  const response = await fetch(`https://api.meldrx.com/patients/${patientId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.MELDRX_API_KEY}`
    }
  });

  console.log("Getting Response from MeldRx:", response);

  if (!response.ok) {
    throw new Error(`Error fetching patient data: ${response.statusText}`);
  }

  return response.json();
}

// Function to send data to Gemini
async function sendDataToGemini(data: any) {
  const request = {
    contents: [{ role: 'user', parts: [{ text: prompt }, { inline_data: { data: JSON.stringify(data), mimeType: 'application/json' } }] }],
  };

  const streamingResult = await generativeVisionModel.generateContentStream(request);
  const contentResponse = await streamingResult.response;

  return contentResponse;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const patientId = formData.get('patientId') as string;

    if (!file || !patientId) {
      return NextResponse.json({ error: 'No file or patient ID provided' }, { status: 400 });
    }

    const imageData = await file.arrayBuffer();
    const base64Image = Buffer.from(imageData).toString('base64');

    const patientData = await fetchPatientData(patientId);
    const geminiResponse = await sendDataToGemini({ image: base64Image, patientData });

    const result = geminiResponse.candidates[0].content.parts[0].text;

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
