import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const ACCESS_TOKEN = 'access_token';

async function proxyReviews(request: NextRequest) {
  const url = `${API_URL}/api/store/reviews`;

  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const body = await request.text();
  const backendRes = await fetch(url, {
    method: request.method,
    headers,
    body: body || undefined,
    cache: 'no-store',
  });

  const text = await backendRes.text();
  return new NextResponse(text, {
    status: backendRes.status,
    headers: { 'Content-Type': backendRes.headers.get('content-type') ?? 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  return proxyReviews(request);
}
