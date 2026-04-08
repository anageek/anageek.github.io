import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'data', 'site.json');

export async function GET() {
  try {
    const fileData = await fs.readFile(dataPath, 'utf8');
    return NextResponse.json(JSON.parse(fileData));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 });
  }
}
