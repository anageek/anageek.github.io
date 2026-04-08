import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const dataPath = path.join(process.cwd(), 'data', 'site.json');

async function getSiteConfig() {
  try {
    const fileData = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(fileData);
  } catch {
    // Return empty object if file does not exist yet to fail gracefully
    return {};
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = await request.json();
    const config = await getSiteConfig();
    
    const newConfig = { ...config, ...payload };
    
    await fs.writeFile(dataPath, JSON.stringify(newConfig, null, 2), 'utf8');
    return NextResponse.json({ success: true, config: newConfig });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
