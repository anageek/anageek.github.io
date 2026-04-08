import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { saveCategories, saveProjects, saveSiteConfig } from '@/lib/db';

// One-time endpoint to populate KV with data from JSON files
export async function POST() {
  let session;
  try { session = await getSession(); } catch { /* invalid token */ }
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const read = async (file: string) => {
      try {
        return JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', file), 'utf8'));
      } catch {
        return null;
      }
    };

    const [categories, projects, site] = await Promise.all([
      read('categories.json'),
      read('projects.json'),
      read('site.json'),
    ]);

    if (categories) await saveCategories(categories);
    if (projects) await saveProjects(projects);
    if (site) await saveSiteConfig(site);

    return NextResponse.json({ success: true, seeded: { categories: !!categories, projects: !!projects, site: !!site } });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
