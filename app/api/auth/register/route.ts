import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const SESSION_COOKIE = 'session_id';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
  };
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  try {
    const res = await fetch(`${API_URL}/api/store/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        ...(sessionId ? { session_id: sessionId } : {}),
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch {
    return NextResponse.json(
      { error: { code: 'NETWORK_ERROR', message: 'Impossible de créer le compte' } },
      { status: 502 },
    );
  }
}
