import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  await redis.set("testKey", "Hello, Upstash with App Router!");
  const value = await redis.get("testKey");
  return NextResponse.json({ message: value });
}
