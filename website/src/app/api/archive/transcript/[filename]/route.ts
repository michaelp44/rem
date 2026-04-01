import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const SERVER = process.env.MEETING_SERVER_URL ?? 'http://localhost:8766';
const ALLOWED_EMAIL = 'mm1992@gmail.com';

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${SERVER}/archive/transcript/${encodeURIComponent(params.filename)}`);
  if (!res.ok) return Response.json({ error: 'Not found' }, { status: 404 });
  const data = await res.json();
  return Response.json(data);
}
