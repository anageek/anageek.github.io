import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');

export async function GET() {
  try {
    const fileData = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(fileData);
    // Only return visible categories
    return NextResponse.json(categories.filter((c: any) => c.visible !== false));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
