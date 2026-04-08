import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'data', 'projects.json');
const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');

export async function GET() {
  try {
    const fileData = await fs.readFile(dataPath, 'utf8');
    const projects = JSON.parse(fileData);

    let categories = [];
    try {
      const catData = await fs.readFile(categoriesPath, 'utf8');
      categories = JSON.parse(catData);
    } catch {
      // ignore
    }

    // Filter project keys based on category visibility
    const visibleSlugs = new Set(categories.filter((c: any) => c.visible !== false).map((c: any) => c.slug));
    
    // If categories is empty, assume all are visible (fallback)
    const result: Record<string, any> = {};
    for (const key in projects) {
      if (categories.length === 0 || visibleSlugs.has(key)) {
        // Also only return visible projects
        result[key] = projects[key].filter((p: any) => p.visible !== false);
      }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
