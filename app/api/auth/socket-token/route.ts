import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'access_token';

/**
 * Returns the raw access token (from the httpOnly cookie) to the same-origin
 * client so it can authenticate the Socket.IO connection to the backend.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ token: null }, { status: 200 });
  }
  return NextResponse.json({ token }, { status: 200 });
}
