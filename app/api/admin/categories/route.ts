import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getCategories, saveCategories, getProjects, saveProjects } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/admin/categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let session;
  try { session = await getSession(); } catch { /* invalid token */ }
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { action, category } = body;
    let categories = await getCategories();

    if (action === 'create') {
      categories.push({ ...category });
      const projects = await getProjects();
      if (!projects[category.slug]) {
        projects[category.slug] = [];
        await saveProjects(projects);
      }
    } else if (action === 'update') {
      const index = categories.findIndex((c: any) => c.slug === category.slug);
      if (index !== -1) categories[index] = category;
    } else if (action === 'delete') {
      categories = categories.filter((c: any) => c.slug !== category.slug);
    }

    await saveCategories(categories);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('POST /api/admin/categories error:', error);
    return NextResponse.json({ error: 'Failed to update categories' }, { status: 500 });
  }
}
