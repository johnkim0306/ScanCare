import { NextRequest, NextResponse } from 'next/server';

const rateLimit = (limit: number, windowMs: number) => {
  const requests: { [key: string]: { count: number; timestamp: number } } = {};

  return (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const now = Date.now();

    if (!requests[ip]) {
      requests[ip] = { count: 1, timestamp: now };
    } else {
      const timePassed = now - requests[ip].timestamp;
      if (timePassed > windowMs) {
        requests[ip] = { count: 1, timestamp: now };
      } else {
        requests[ip].count += 1;
      }
    }

    if (requests[ip].count > limit) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    return null;
  };
};

export default rateLimit;
