import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const COOKIE_NAME = 'access_token';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await fetch(`${API_URL}/api/store/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // Continue to clear cookie even if backend call fails
    }
  }

  const response = NextResponse.json({ data: { success: true } });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
