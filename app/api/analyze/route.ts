import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { promisify } from 'util';
import { redis } from "@/lib/redis";
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

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
  Analyze this image to find the names of the foods in the image. 
  Write the food item and your estimate for the expiry date for that item when stored appropriately, in an array of objects format.
  Use this example as context: [{"name": "bread", "expiry": 10}, {"name": "apple", "expiry": 8}, {"name": "coffee", "expiry": 16}]
  There are two properties: the name of the item with no adjectives in lowercase, 
  and the number of days before it will go bad when stored appropriately as an integer.
  If no food items are found, return -1.
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

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const imageData = await file.arrayBuffer();
    const base64Image = Buffer.from(imageData).toString('base64');

    const filePart = { 
      inline_data: { data: base64Image, mimeType: 'image/jpeg' } };
    const textPart = { text: prompt };
    const request = {
      contents: [{ role: 'user', parts: [textPart, filePart] }],
    };

    const streamingResult = await generativeVisionModel.generateContentStream(request);
    const contentResponse = await streamingResult.response;
    const result = contentResponse.candidates[0].content.parts[0].text;

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
