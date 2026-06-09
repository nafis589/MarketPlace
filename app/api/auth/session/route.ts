import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const COOKIE_NAME = 'access_token';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ data: null });
  }

  try {
    const res = await fetch(`${API_URL}/api/store/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const response = NextResponse.json({ data: null });
      response.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
      return response;
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ data: null });
  }
}
