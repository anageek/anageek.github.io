import { faker } from '@faker-js/faker'

export function buildProject(overrides?: Record<string, unknown>) {
  return {
    slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
    categoryId: 1,
    title: faker.commerce.productName(),
    role: faker.person.jobTitle(),
    company: faker.company.name(),
    status: faker.helpers.arrayElement(['Released', 'In Development', 'Alpha Version']),
    subCategory: faker.commerce.department(),
    platform: [faker.helpers.arrayElement(['PC', 'Mobile', 'VR', 'Console'])],
    description: faker.lorem.paragraph(),
    tools: faker.helpers.arrayElements(['Figma', 'Unreal Engine', 'Blender', 'Photoshop'], 2).join(', '),
    coverImage: '/images/placeholder.png',
    coverAnimated: '/images/placeholder.gif',
    visible: true,
    featured: false,
    sortOrder: 0,
    ...overrides,
  }
}
