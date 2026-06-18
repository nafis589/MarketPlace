import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = process.env.REVALIDATION_SECRET;
  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!secret || token !== secret) {
    return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
  }

  let paths: string[] = ['/'];
  try {
    const body = (await request.json()) as { paths?: string[] };
    if (Array.isArray(body.paths) && body.paths.length > 0) {
      paths = body.paths;
    }
  } catch {
    // default paths
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ data: { revalidated: paths } });
}
