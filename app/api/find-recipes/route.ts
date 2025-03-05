import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { redis } from "@/lib/redis";

// Rate Limit Configuration
const MAX_REQUESTS = 3;
const WINDOW_SECONDS = 60; 
const CACHE_EXPIRY_SECONDS = 3600;

async function isRateLimited(ip: string): Promise<boolean> {
  const cacheKey = `rate-limit:${ip}`;
  const requests = await redis.incr(cacheKey);

  console.log(`IP ${ip} has made ${requests} requests`);
  if (requests === 1) {
    await redis.expire(cacheKey, WINDOW_SECONDS);
  }

  return requests > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {

    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

    if (await isRateLimited(ip)) {
      const ttl = await redis.ttl(`rate-limit:${ip}`);
      return NextResponse.json(
        { 
          message: `You're sending too many requests! Please wait ${ttl} seconds before trying again.`,
          retry_after: ttl 
        }, 
        { status: 429 }
      );
    }

    const { foodItems } = await req.json();
    console.log("Received food items:", foodItems);

    const cacheKey = `recipes:${JSON.stringify(foodItems)}`;
    const cachedResponse = await redis.get(cacheKey);

    if (cachedResponse) {
      try {
        console.log("Cache hit ✅ Returning cached recipes");
        return NextResponse.json(cachedResponse);
      } catch (error) {
        console.error("Error parsing cached response:", error);
        return NextResponse.json({ error: "Invalid cached data" }, { status: 500 });
      }
    } else {
      console.log("Cache miss ❌ Running recipe model...");
    }

    const pythonPath = '/home/john_kim/nofoodwaste/python_env/myenv/bin/python';
    const scriptPath = path.join('/home/john_kim/nofoodwaste/python_env', 'train_model.py');
    const pythonProcess = spawn(pythonPath, [scriptPath, JSON.stringify(foodItems)]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    return new Promise((resolve, reject) => {
      pythonProcess.on('close', async (code) => {
        if (code !== 0 || !result) {
          console.error(`[${new Date().toISOString()}] ❌ Python script failed or returned no data.`);
          reject(new Error('Python script failed'));
        } else {
          console.log("Model execution successful ✅ Caching result...");
          const resultString = typeof result === 'string' ? result : JSON.stringify(result);
          await redis.setex(cacheKey, CACHE_EXPIRY_SECONDS, resultString);
          resolve(NextResponse.json(JSON.parse(result)));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}
