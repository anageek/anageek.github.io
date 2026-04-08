import { NextResponse } from 'next/server';
import { getCategories, getProjects } from '@/lib/db';

export async function GET() {
  try {
    const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
    const visibleSlugs = new Set(categories.filter((c: any) => c.visible !== false).map((c: any) => c.slug));

    const result: Record<string, any> = {};
    for (const key in projects) {
      if (categories.length === 0 || visibleSlugs.has(key)) {
        result[key] = projects[key].filter((p: any) => p.visible !== false);
      }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
