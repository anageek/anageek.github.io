import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/db';

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 });
  }
}
