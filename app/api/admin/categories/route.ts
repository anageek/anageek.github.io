import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
const projectsPath = path.join(process.cwd(), 'data', 'projects.json');

async function getCategories() {
  const fileData = await fs.readFile(categoriesPath, 'utf8');
  return JSON.parse(fileData);
}

async function saveCategories(categories: any) {
  await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2), 'utf8');
}

async function getProjects() {
  const fileData = await fs.readFile(projectsPath, 'utf8');
  return JSON.parse(fileData);
}

async function saveProjects(projects: any) {
  await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), 'utf8');
}

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
      const { isNew, ...rest } = category;
      const newCategory = { id: rest.slug, ...rest };
      categories.push(newCategory);
      
      // Also update projects.json structure
      const projects = await getProjects();
      if (!projects[newCategory.slug]) {
        projects[newCategory.slug] = [];
        await saveProjects(projects);
      }
    } 
    else if (action === 'update') {
      const { isNew, ...rest } = category;
      const index = categories.findIndex((c: any) => c.slug === rest.slug);
      if (index !== -1) categories[index] = rest;
    } 
    else if (action === 'delete') {
      categories = categories.filter((c: any) => c.slug !== category.slug);
      // Optional: hide or move projects of this category? 
      // For now we just remove from the list, the projects.json key remains.
    }

    await saveCategories(categories);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update categories' }, { status: 500 });
  }
}
