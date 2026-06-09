import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'access_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token?: string };

  if (!body.token) {
    return NextResponse.json(
      { error: { code: 'INVALID_REQUEST', message: 'Token manquant' } },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ data: { success: true } });
  response.cookies.set(COOKIE_NAME, body.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });

  return response;
}

export async function DELETE() {
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
