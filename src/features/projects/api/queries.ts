'use server'
import 'server-only'
import { db } from '@/lib/db'
import { projects, projectImages, projectSections, sectionBlocks } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getPublicProjects() {
  return db.query.projects.findMany({
    where: eq(projects.visible, true),
    with: {
      category: true,
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
    },
    orderBy: (projects, { asc }) => [asc(projects.sortOrder)],
  })
}

export async function getFeaturedProjects() {
  return db.query.projects.findMany({
    where: and(eq(projects.visible, true), eq(projects.featured, true)),
    with: {
      category: true,
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
    },
    orderBy: (projects, { asc }) => [asc(projects.sortOrder)],
  })
}

export async function getProjectBySlug(slug: string) {
  return db.query.projects.findFirst({
    where: and(eq(projects.slug, slug), eq(projects.visible, true)),
    with: {
      category: true,
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.sortOrder)],
        with: {
          blocks: { orderBy: (blocks, { asc }) => [asc(blocks.sortOrder)] },
        },
      },
    },
  })
}

export async function getAdminProjects() {
  return db.query.projects.findMany({
    with: {
      category: true,
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
    },
    orderBy: (projects, { asc }) => [asc(projects.sortOrder)],
  })
}

export async function getAdminProjectById(id: number) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      category: true,
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.sortOrder)],
        with: {
          blocks: { orderBy: (blocks, { asc }) => [asc(blocks.sortOrder)] },
        },
      },
    },
  })
}
