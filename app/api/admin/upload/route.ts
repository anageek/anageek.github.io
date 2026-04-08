import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  let session;
  try { session = await getSession(); } catch { /* invalid token */ }
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    if (useBlob) {
      const { put } = await import('@vercel/blob');
      const blob = await put(file.name, file, { access: 'public' });
      return NextResponse.json({ url: blob.url });
    }

    // Local fallback: save to public/images/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ url: `/images/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
