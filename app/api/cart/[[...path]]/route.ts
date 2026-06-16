import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ACCESS_TOKEN = 'access_token';
const SESSION_COOKIE = 'session_id';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

function buildBackendPath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return '';
  return `/${segments.join('/')}`;
}

async function proxyCart(request: NextRequest, segments: string[] | undefined) {
  const suffix = buildBackendPath(segments);
  const url = `${API_URL}/api/store/cart${suffix}`;

  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (sessionId) {
    headers.Cookie = `${SESSION_COOKIE}=${sessionId}`;
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.text();
    if (body) init.body = body;
  }

  const backendRes = await fetch(url, init);
  const text = await backendRes.text();

  const response = new NextResponse(text, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('content-type') ?? 'application/json',
    },
  });

  const setCookies = backendRes.headers.getSetCookie?.() ?? [];
  const rawSetCookie = backendRes.headers.get('set-cookie');
  const cookieHeaders = setCookies.length > 0 ? setCookies : rawSetCookie ? [rawSetCookie] : [];

  for (const header of cookieHeaders) {
    const match = header.match(/session_id=([^;]+)/);
    if (match) {
      response.cookies.set(SESSION_COOKIE, match[1], {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
        secure: process.env.NODE_ENV === 'production',
      });
    }
  }

  return response;
}

type RouteContext = { params: Promise<{ path?: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyCart(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyCart(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyCart(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyCart(request, path);
}
