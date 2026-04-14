import { getPublicProjects } from '@/features/projects'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const projects = await getPublicProjects()
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
