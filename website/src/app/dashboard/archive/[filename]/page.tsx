import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileAudio } from 'lucide-react';

const ALLOWED_EMAIL = 'mm19924@gmail.com';
const SERVER = process.env.MEETING_SERVER_URL ?? 'http://localhost:8766';

export default async function TranscriptPage({
  params,
}: {
  params: { filename: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  if (email !== ALLOWED_EMAIL) redirect('/dashboard');

  const filename = decodeURIComponent(params.filename);

  let transcript: string | null = null;
  try {
    const res = await fetch(`${SERVER}/archive/transcript/${encodeURIComponent(filename)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      transcript = data.transcript;
    }
  } catch {
    // server unreachable
  }

  return (
    <div className="min-h-[80vh] gradient-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard/archive"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive
          </Link>
          <div className="flex items-center gap-3">
            <FileAudio className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 break-all">{filename}</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {transcript ? (
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm font-mono" dir="rtl">
              {transcript}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Could not load transcript. Make sure the server is running.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
