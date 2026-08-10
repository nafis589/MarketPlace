import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const ACCESS_TOKEN = 'access_token';

function buildBackendPath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) return '';
  return `/${segments.join('/')}`;
}

async function proxyPayment(request: NextRequest, segments: string[] | undefined) {
  const suffix = buildBackendPath(segments);
  const query = request.nextUrl.search;
  const url = `${API_URL}/api/store/payment${suffix}${query}`;

  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  if (!token) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Connexion requise' } },
      { status: 401 },
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const init: RequestInit = { method: request.method, headers };

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
  return proxyPayment(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyPayment(request, path);
}
