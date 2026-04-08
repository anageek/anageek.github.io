import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSiteConfig, saveSiteConfig } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('GET /api/admin/site error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let session;
  try { session = await getSession(); } catch { /* invalid token */ }
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = await request.json();
    const config = await getSiteConfig();
    const newConfig = { ...config, ...payload };
    await saveSiteConfig(newConfig);
    return NextResponse.json({ success: true, config: newConfig });
  } catch (error) {
    console.error('POST /api/admin/site error:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
