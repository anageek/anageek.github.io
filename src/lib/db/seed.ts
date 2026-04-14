import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { readFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Ensure data directory exists
mkdirSync(join(process.cwd(), 'data'), { recursive: true })

const dbPath = join(process.cwd(), 'data', 'portfolio.db')
const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

const db = drizzle(sqlite, { schema })

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function seed() {
  console.log('Seeding database...')

  const categoriesJson = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'categories.json'), 'utf8')
  ) as Array<{ id: string; slug: string; label: string; icon: string; visible?: boolean }>

  const projectsJson = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'projects.json'), 'utf8')
  ) as Record<string, any[]>

  const siteJson = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'site.json'), 'utf8')
  ) as Record<string, string>

  console.log(`Inserting ${categoriesJson.length} categories...`)
  const insertedCategories: Record<string, number> = {}

  for (const [idx, cat] of categoriesJson.entries()) {
    const [inserted] = await db.insert(schema.categories).values({
      slug: cat.slug,
      label: cat.label,
      icon: cat.icon,
      visible: cat.visible !== false,
      sortOrder: idx,
    }).returning()
    insertedCategories[cat.slug] = inserted.id
  }

  let totalProjects = 0
  let totalSections = 0
  let totalBlocks = 0
  const usedSlugs = new Set<string>()

  for (const [categorySlug, projectsList] of Object.entries(projectsJson)) {
    const categoryId = insertedCategories[categorySlug]
    if (!categoryId) {
      console.warn(`Category '${categorySlug}' not found, skipping...`)
      continue
    }

    for (const [pIdx, project] of projectsList.entries()) {
      let baseSlug = `${slugify(project.title)}-${categorySlug}`
      let projectSlug = baseSlug
      let counter = 1
      while (usedSlugs.has(projectSlug)) {
        projectSlug = `${baseSlug}-${counter++}`
      }
      usedSlugs.add(projectSlug)

      const [insertedProject] = await db.insert(schema.projects).values({
        slug: projectSlug,
        categoryId,
        title: project.title,
        role: project.role || null,
        company: project.company || null,
        status: project.status || null,
        subCategory: project.category || null,
        platform: project.platform || [],
        description: project.description || null,
        tools: project.tools || null,
        coverImage: project.coverImage || null,
        coverAnimated: project.coverAnimated || null,
        videoUrl: project.videoUrl || null,
        designUrl: project.designurl || null,
        designBtnLabel: project.designButtonLabel || null,
        visible: project.visible !== false,
        featured: project.featured === true,
        sortOrder: pIdx,
      }).returning()
      totalProjects++

      if (project.images?.length) {
        await db.insert(schema.projectImages).values(
          project.images.map((url: string, imgIdx: number) => ({
            projectId: insertedProject.id,
            url: url.split('?')[0],
            sortOrder: imgIdx,
          }))
        )
      }

      if (project.sections?.length) {
        for (const [sIdx, section] of project.sections.entries()) {
          const [insertedSection] = await db.insert(schema.projectSections).values({
            projectId: insertedProject.id,
            title: section.title,
            image: section.image || null,
            video: section.video || null,
            sortOrder: sIdx,
          }).returning()
          totalSections++

          if (section.description?.length) {
            for (const [bIdx, block] of section.description.entries()) {
              await db.insert(schema.sectionBlocks).values({
                sectionId: insertedSection.id,
                type: block.type || 'paragraph',
                text: block.text || null,
                image: block.image || null,
                video: block.video || null,
                items: block.items || null,
                sortOrder: bIdx,
              })
              totalBlocks++
            }
          }
        }
      }
    }
  }

  for (const [key, value] of Object.entries(siteJson)) {
    await db.insert(schema.siteConfig).values({ key, value: String(value) })
  }

  console.log(`Seed complete:`)
  console.log(`  - ${categoriesJson.length} categories`)
  console.log(`  - ${totalProjects} projects`)
  console.log(`  - ${totalSections} sections`)
  console.log(`  - ${totalBlocks} blocks`)
  console.log(`  - ${Object.keys(siteJson).length} site config entries`)

  sqlite.close()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  sqlite.close()
  process.exit(1)
})
