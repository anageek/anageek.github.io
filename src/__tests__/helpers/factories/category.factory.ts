import { faker } from '@faker-js/faker'

export function buildCategory(overrides?: Record<string, unknown>) {
  const label = faker.commerce.department()
  return {
    slug: faker.helpers.slugify(label).toLowerCase(),
    label,
    icon: faker.helpers.arrayElement(['Gamepad2', 'Palette', 'Boxes', 'Grid']),
    visible: true,
    sortOrder: 0,
    ...overrides,
  }
}
