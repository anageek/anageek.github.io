import type { MetadataRoute } from 'next'
import { getPublicProjects } from '@/features/projects'
import { siteConfig } from '@/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublicProjects()

  const projectUrls = projects.map((project) => ({
    url: `${siteConfig.url}/project/${project.slug}`,
    lastModified: new Date(project.updatedAt ?? project.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectUrls,
  ]
}
