import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const ACCESS_TOKEN = 'access_token';

function buildBackendPath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return '';
  return `/${segments.join('/')}`;
}

async function proxyChat(request: NextRequest, segments: string[] | undefined) {
  const suffix = buildBackendPath(segments);
  const query = request.nextUrl.search;
  const url = `${API_URL}/api/store/conversations${suffix}${query}`;

  const token = request.cookies.get(ACCESS_TOKEN)?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.text();
    if (body) init.body = body;
  }

  const backendRes = await fetch(url, init);
  const text = await backendRes.text();

  return new NextResponse(text, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('content-type') ?? 'application/json',
    },
  });
}

type RouteContext = { params: Promise<{ path?: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyChat(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyChat(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyChat(request, path);
}
