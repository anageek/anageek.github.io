import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProjects, saveProjects } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/admin/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let session;
  try { session = await getSession(); } catch { /* invalid token */ }
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { action, category, originalCategory, project } = await request.json();
    const projects = await getProjects();

    if (!projects[category]) projects[category] = [];

    if (action === 'create') {
      const maxId = Math.max(0, ...projects[category].map((p: any) => p.id));
      const newProject = { ...project, id: maxId + 1 };
      delete newProject.projectCategory;
      projects[category].push(newProject);
    } else if (action === 'update') {
      const isMovingCategory = originalCategory && category !== originalCategory;
      const targetCategory = isMovingCategory ? originalCategory : category;
      const index = projects[targetCategory]?.findIndex((p: any) => p.id === project.id);

      if (index !== -1 && index !== undefined) {
        const updated = { ...project };
        delete updated.projectCategory;

        if (isMovingCategory) {
          projects[originalCategory].splice(index, 1);
          if (!projects[category]) projects[category] = [];
          const maxId = Math.max(0, ...projects[category].map((p: any) => p.id));
          updated.id = maxId + 1;
          projects[category].push(updated);
        } else {
          projects[category][index] = updated;
        }
      }
    } else if (action === 'delete') {
      projects[category] = projects[category].filter((p: any) => p.id !== project.id);
    }

    await saveProjects(projects);
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('POST /api/admin/projects error:', error);
    return NextResponse.json({ error: 'Failed to update projects' }, { status: 500 });
  }
}
