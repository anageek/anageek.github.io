export const dynamic = 'force-static';
import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const dataPath = path.join(process.cwd(), 'data', 'projects.json');

async function getProjects() {
  const fileData = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(fileData);
}

async function saveProjects(projects: any) {
  await fs.writeFile(dataPath, JSON.stringify(projects, null, 2), 'utf8');
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { action, category, project } = await request.json();
    const projects = await getProjects();

    if (!projects[category]) {
      projects[category] = [];
    }

    if (action === 'create') {
      // Find max ID for this category
      const maxId = Math.max(0, ...projects[category].map((p: any) => p.id));
      const newProject = { ...project, id: maxId + 1 };
      projects[category].push(newProject);
    } 
    else if (action === 'update') {
      const index = projects[category].findIndex((p: any) => p.id === project.id);
      if (index !== -1) {
        projects[category][index] = project;
      }
    } 
    else if (action === 'delete') {
      projects[category] = projects[category].filter((p: any) => p.id !== project.id);
    }

    await saveProjects(projects);
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update projects' }, { status: 500 });
  }
}
