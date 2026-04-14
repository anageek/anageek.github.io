# Anageek Portfolio — Full Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Anageek portfolio from a flat JSON-filesystem Next.js app into a production-ready, well-architected application following Bulletproof React + Next.js App Router industry standards, with Vercel Postgres, Drizzle ORM, Server Actions, full type safety, and comprehensive test coverage.

**Architecture:** Bulletproof React feature-based architecture adapted for Next.js 15 App Router. Thin `app/` routing layer, `features/` as the core domain (components, hooks, types, server actions per feature), `lib/` for infrastructure (db, auth, storage), `components/` for shared UI. Server Components by default, `'use client'` only for interactive leaf components. Server Actions replace traditional API routes for mutations.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Drizzle ORM, Vercel Postgres (Neon), Vercel Blob, Zod, shadcn/ui, Tailwind CSS, Vitest, Testing Library, Playwright

---

## File Structure

### New files to create

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── project/[slug]/page.tsx
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── categories/page.tsx
│   │       └── settings/page.tsx
│   ├── api/
│   │   ├── projects/route.ts
│   │   ├── categories/route.ts
│   │   └── site/route.ts
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   └── globals.css
├── features/
│   ├── projects/
│   │   ├── api/queries.ts
│   │   ├── api/actions.ts
│   │   ├── components/project-card.tsx
│   │   ├── components/project-grid.tsx
│   │   ├── components/project-table.tsx
│   │   ├── components/project-detail.tsx
│   │   ├── components/project-gallery.tsx
│   │   ├── components/section-renderer.tsx
│   │   ├── components/project-form/index.tsx
│   │   ├── components/project-form/overview-tab.tsx
│   │   ├── components/project-form/content-tab.tsx
│   │   ├── components/project-form/section-editor.tsx
│   │   ├── hooks/use-project-form.ts
│   │   ├── types/project.ts
│   │   └── index.ts
│   ├── categories/
│   │   ├── api/queries.ts
│   │   ├── api/actions.ts
│   │   ├── components/category-list.tsx
│   │   ├── components/category-form.tsx
│   │   ├── types/category.ts
│   │   └── index.ts
│   ├── auth/
│   │   ├── api/actions.ts
│   │   ├── components/login-form.tsx
│   │   ├── types/auth.ts
│   │   └── index.ts
│   ├── hero/
│   │   ├── components/video-hero.tsx
│   │   └── index.ts
│   ├── about/
│   │   ├── components/about-section.tsx
│   │   └── index.ts
│   ├── contact/
│   │   ├── components/contact-section.tsx
│   │   └── index.ts
│   └── site-config/
│       ├── api/queries.ts
│       ├── api/actions.ts
│       ├── types/site-config.ts
│       └── index.ts
├── components/
│   ├── ui/ (copied from existing, untouched)
│   ├── layouts/public-header.tsx
│   ├── layouts/public-footer.tsx
│   ├── layouts/admin-sidebar.tsx
│   ├── common/stat-card.tsx
│   ├── common/loading-skeleton.tsx
│   ├── common/empty-state.tsx
│   ├── common/confirm-dialog.tsx
│   ├── forms/field.tsx
│   ├── forms/link-field.tsx
│   └── forms/image-upload.tsx
├── lib/
│   ├── db/index.ts
│   ├── db/schema/categories.ts
│   ├── db/schema/projects.ts
│   ├── db/schema/project-images.ts
│   ├── db/schema/project-sections.ts
│   ├── db/schema/section-blocks.ts
│   ├── db/schema/site-config.ts
│   ├── db/schema/relations.ts
│   ├── db/schema/index.ts
│   ├── db/seed.ts
│   ├── auth/session.ts
│   ├── auth/guards.ts
│   ├── storage/vercel-blob.ts
│   └── utils.ts
├── config/
│   ├── env.ts
│   ├── site.ts
│   └── navigation.ts
├── hooks/use-mobile.ts
├── types/api.ts
├── middleware.ts
├── __tests__/
│   ├── unit/features/projects/actions.test.ts
│   ├── unit/features/projects/queries.test.ts
│   ├── unit/features/categories/actions.test.ts
│   ├── unit/features/auth/actions.test.ts
│   ├── unit/lib/auth/session.test.ts
│   ├── unit/lib/utils.test.ts
│   ├── unit/config/env.test.ts
│   ├── integration/api/projects.test.ts
│   ├── integration/api/categories.test.ts
│   ├── e2e/auth.spec.ts
│   ├── e2e/public-navigation.spec.ts
│   ├── e2e/admin-projects.spec.ts
│   └── helpers/
│       ├── factories/project.factory.ts
│       ├── factories/category.factory.ts
│       ├── db.ts
│       └── setup.ts
├── drizzle.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

### Files to delete (after migration complete)

```
app/ (entire old directory)
components/header.tsx
components/video-hero.tsx
components/projects-section.tsx
components/project-card.tsx
components/about-section.tsx
components/contact-section.tsx
components/theme-provider.tsx
data/projects.json
data/categories.json
data/site.json
data/projects-backup.ts
public/Projects-Content.ts (if exists)
hooks/use-mobile.tsx
hooks/use-toast.ts
lib/auth.ts
lib/utils.ts
middleware.ts
```

---

## Phase 1: Foundation — Project Setup

### Task 1: Initialize src/ directory and move config

**Files:**
- Create: `src/` directory structure
- Modify: `tsconfig.json` (update paths)
- Modify: `next.config.mjs` (no changes needed — Next.js auto-detects src/)
- Modify: `tailwind.config.ts` (update content paths)
- Modify: `components.json` (update aliases)

- [ ] **Step 1: Create the src/ directory structure**

```bash
mkdir -p src/app src/components src/features src/lib src/hooks src/types src/config src/__tests__
```

- [ ] **Step 2: Move existing components/ui/ into src/components/ui/**

```bash
cp -r components/ui src/components/ui
```

- [ ] **Step 3: Update tsconfig.json paths to point to src/**

In `tsconfig.json`, update the paths alias:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Update tailwind.config.ts content paths**

Replace the content array:

```typescript
content: [
  "./src/**/*.{ts,tsx}",
],
```

- [ ] **Step 5: Update components.json aliases**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 6: Copy globals.css to src/app/**

```bash
cp app/globals.css src/app/globals.css
```

- [ ] **Step 7: Verify build compiles**

```bash
yarn next build
```

Expected: Build succeeds (old `app/` still exists alongside `src/app/`, but Next.js prioritizes `src/app/` when both exist). If there are errors, fix import paths.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: initialize src/ directory structure with updated configs"
```

---

### Task 2: Install new dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Drizzle ORM + Postgres driver**

```bash
yarn add drizzle-orm @vercel/postgres
yarn add -D drizzle-kit
```

- [ ] **Step 2: Install Vercel Blob for file uploads**

```bash
yarn add @vercel/blob
```

- [ ] **Step 3: Install server-only package**

```bash
yarn add server-only
```

- [ ] **Step 4: Install test dependencies**

```bash
yarn add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
yarn add -D playwright @playwright/test
```

- [ ] **Step 5: Install test factories**

```bash
yarn add -D @faker-js/faker
```

- [ ] **Step 6: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add drizzle, vercel-blob, server-only, and test dependencies"
```

---

### Task 3: Create test configuration files

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/__tests__/helpers/setup.ts`

- [ ] **Step 1: Create vitest.config.ts**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/helpers/setup.ts'],
    include: ['src/__tests__/unit/**/*.test.ts', 'src/__tests__/integration/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Create playwright.config.ts**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 3: Create test setup file**

```typescript
// src/__tests__/helpers/setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add test scripts to package.json**

Add to the `"scripts"` section of `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts playwright.config.ts src/__tests__/helpers/setup.ts package.json
git commit -m "chore: configure vitest and playwright for testing"
```

---

## Phase 2: Config & Environment Validation

### Task 4: Environment validation with Zod

**Files:**
- Create: `src/config/env.ts`
- Create: `src/__tests__/unit/config/env.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/unit/config/env.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('env validation', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws if SESSION_SECRET is missing', async () => {
    vi.stubEnv('SESSION_SECRET', '')
    vi.stubEnv('ADMIN_EMAIL', 'test@test.com')
    vi.stubEnv('ADMIN_PASSWORD_HASH', 'abc123')
    vi.stubEnv('POSTGRES_URL', 'postgresql://localhost/test')
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_token')

    await expect(async () => {
      vi.resetModules()
      await import('@/config/env')
    }).rejects.toThrow()
  })

  it('parses valid env vars without error', async () => {
    vi.stubEnv('SESSION_SECRET', 'a-very-long-secret-key-that-is-at-least-32-chars')
    vi.stubEnv('ADMIN_EMAIL', 'admin@anageek.me')
    vi.stubEnv('ADMIN_PASSWORD_HASH', 'abc123hash')
    vi.stubEnv('POSTGRES_URL', 'postgresql://localhost/test')
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_xxxx')

    vi.resetModules()
    const { env } = await import('@/config/env')

    expect(env.SESSION_SECRET).toBe('a-very-long-secret-key-that-is-at-least-32-chars')
    expect(env.ADMIN_EMAIL).toBe('admin@anageek.me')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn vitest run src/__tests__/unit/config/env.test.ts
```

Expected: FAIL — `Cannot find module '@/config/env'`

- [ ] **Step 3: Implement env.ts**

```typescript
// src/config/env.ts
import 'server-only'
import { z } from 'zod'

const envSchema = z.object({
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD_HASH: z.string().min(1, 'ADMIN_PASSWORD_HASH is required'),
  POSTGRES_URL: z.string().url('POSTGRES_URL must be a valid URL'),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN is required'),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
```

Note: The `server-only` import will cause issues in tests. Mock it in the test setup or create a conditional import. For tests, add to `vitest.config.ts` resolve aliases:

```typescript
// Add to vitest.config.ts resolve.alias:
'server-only': path.resolve(__dirname, './src/__tests__/helpers/server-only-mock.ts'),
```

Create the mock:

```typescript
// src/__tests__/helpers/server-only-mock.ts
// Empty mock — server-only is a build-time guard, not needed in tests
export {}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn vitest run src/__tests__/unit/config/env.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/config/env.ts src/__tests__/unit/config/env.test.ts src/__tests__/helpers/server-only-mock.ts vitest.config.ts
git commit -m "feat: add Zod-validated environment configuration"
```

---

### Task 5: Site config and navigation constants

**Files:**
- Create: `src/config/site.ts`
- Create: `src/config/navigation.ts`

- [ ] **Step 1: Create site config**

```typescript
// src/config/site.ts
export const siteConfig = {
  name: 'Ana Neiva',
  title: 'Tech UI Designer',
  description: 'Creative Designer & Developer',
  url: 'https://anageek.me',
  email: 'alcneiva@gmail.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/anageek/',
    instagram: 'https://www.instagram.com/ana.geek',
    youtube: 'https://www.youtube.com/AnaGeek',
    twitch: 'https://www.twitch.tv/ana_geek',
  },
  resumeUrl: 'https://docs.google.com/document/d/1pfsjhUDq0WJ0484mZKJoVkk8qn7vb_0lwefoMUKdkIU/edit?usp=sharing',
} as const
```

- [ ] **Step 2: Create navigation config**

```typescript
// src/config/navigation.ts
export const publicNav = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export const adminNav = [
  { label: 'Projects', href: '/admin/projects', icon: 'Layers' },
  { label: 'Categories', href: '/admin/categories', icon: 'Grid' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const
```

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts src/config/navigation.ts
git commit -m "feat: add site and navigation configuration constants"
```

---

### Task 6: Shared utilities

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/__tests__/unit/lib/utils.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/unit/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn, slugify } from '@/lib/utils'

describe('cn', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('px-4 py-1')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })
})

describe('slugify', () => {
  it('converts title to URL-safe slug', () => {
    expect(slugify('Naufrago Game')).toBe('naufrago-game')
  })

  it('handles special characters', () => {
    expect(slugify('UI/UX Design Project')).toBe('ui-ux-design-project')
  })

  it('handles accented characters', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('--hello--world--')).toBe('hello--world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn vitest run src/__tests__/unit/lib/utils.test.ts
```

Expected: FAIL — `slugify is not exported`

- [ ] **Step 3: Implement utils.ts**

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn vitest run src/__tests__/unit/lib/utils.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils.ts src/__tests__/unit/lib/utils.test.ts
git commit -m "feat: add cn and slugify utilities with tests"
```

---

## Phase 3: Database Layer

### Task 7: Drizzle schema definitions

**Files:**
- Create: `src/lib/db/schema/categories.ts`
- Create: `src/lib/db/schema/projects.ts`
- Create: `src/lib/db/schema/project-images.ts`
- Create: `src/lib/db/schema/project-sections.ts`
- Create: `src/lib/db/schema/section-blocks.ts`
- Create: `src/lib/db/schema/site-config.ts`
- Create: `src/lib/db/schema/relations.ts`
- Create: `src/lib/db/schema/index.ts`

- [ ] **Step 1: Create categories schema**

```typescript
// src/lib/db/schema/categories.ts
import { pgTable, serial, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  visible: boolean('visible').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

- [ ] **Step 2: Create projects schema**

```typescript
// src/lib/db/schema/projects.ts
import { pgTable, serial, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { categories } from './categories'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  company: varchar('company', { length: 255 }),
  status: varchar('status', { length: 100 }),
  subCategory: varchar('sub_category', { length: 100 }),
  platform: text('platform').array(),
  description: text('description'),
  tools: varchar('tools', { length: 500 }),
  coverImage: text('cover_image'),
  coverAnimated: text('cover_animated'),
  videoUrl: text('video_url'),
  designUrl: text('design_url'),
  designBtnLabel: varchar('design_btn_label', { length: 100 }),
  visible: boolean('visible').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

- [ ] **Step 3: Create project-images schema**

```typescript
// src/lib/db/schema/project-images.ts
import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const projectImages = pgTable('project_images', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
})
```

- [ ] **Step 4: Create project-sections schema**

```typescript
// src/lib/db/schema/project-sections.ts
import { pgTable, serial, integer, varchar, text } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const projectSections = pgTable('project_sections', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  image: text('image'),
  video: text('video'),
  sortOrder: integer('sort_order').default(0).notNull(),
})
```

- [ ] **Step 5: Create section-blocks schema**

```typescript
// src/lib/db/schema/section-blocks.ts
import { pgTable, serial, integer, varchar, text, jsonb } from 'drizzle-orm/pg-core'
import { projectSections } from './project-sections'

export const sectionBlocks = pgTable('section_blocks', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => projectSections.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  text: text('text'),
  image: text('image'),
  video: text('video'),
  items: jsonb('items').$type<string[]>(),
  sortOrder: integer('sort_order').default(0).notNull(),
})
```

- [ ] **Step 6: Create site-config schema**

```typescript
// src/lib/db/schema/site-config.ts
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const siteConfig = pgTable('site_config', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

- [ ] **Step 7: Create relations**

```typescript
// src/lib/db/schema/relations.ts
import { relations } from 'drizzle-orm'
import { categories } from './categories'
import { projects } from './projects'
import { projectImages } from './project-images'
import { projectSections } from './project-sections'
import { sectionBlocks } from './section-blocks'

export const categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
  images: many(projectImages),
  sections: many(projectSections),
}))

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}))

export const projectSectionsRelations = relations(projectSections, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectSections.projectId],
    references: [projects.id],
  }),
  blocks: many(sectionBlocks),
}))

export const sectionBlocksRelations = relations(sectionBlocks, ({ one }) => ({
  section: one(projectSections, {
    fields: [sectionBlocks.sectionId],
    references: [projectSections.id],
  }),
}))
```

- [ ] **Step 8: Create barrel export**

```typescript
// src/lib/db/schema/index.ts
export { categories } from './categories'
export { projects } from './projects'
export { projectImages } from './project-images'
export { projectSections } from './project-sections'
export { sectionBlocks } from './section-blocks'
export { siteConfig } from './site-config'
export {
  categoriesRelations,
  projectsRelations,
  projectImagesRelations,
  projectSectionsRelations,
  sectionBlocksRelations,
} from './relations'
```

- [ ] **Step 9: Commit**

```bash
git add src/lib/db/schema/
git commit -m "feat: define Drizzle ORM schema for all database tables"
```

---

### Task 8: Database client and Drizzle config

**Files:**
- Create: `src/lib/db/index.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1: Create database client**

```typescript
// src/lib/db/index.ts
import 'server-only'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export const db = drizzle(sql, { schema })

export type Database = typeof db
```

- [ ] **Step 2: Create Drizzle config for migrations**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/db/schema/*.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})
```

- [ ] **Step 3: Add migration scripts to package.json**

Add to `"scripts"`:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio",
"db:seed": "npx tsx src/lib/db/seed.ts"
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/index.ts drizzle.config.ts package.json
git commit -m "feat: configure Drizzle client and migration tooling"
```

---

### Task 9: Seed script — migrate JSON data to Postgres

**Files:**
- Create: `src/lib/db/seed.ts`

- [ ] **Step 1: Create the seed script**

```typescript
// src/lib/db/seed.ts
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'
import { readFileSync } from 'fs'
import { join } from 'path'

const db = drizzle(sql, { schema })

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

  // 1. Read JSON files
  const categoriesJson = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'categories.json'), 'utf8')
  ) as Array<{ id: string; slug: string; label: string; icon: string; visible?: boolean }>

  const projectsJson = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'projects.json'), 'utf8')
  ) as Record<string, any[]>

  const siteJson = JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'site.json'), 'utf8')
  ) as Record<string, string>

  // 2. Insert categories
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

  // 3. Insert projects with their images, sections, and blocks
  let totalProjects = 0
  let totalSections = 0
  let totalBlocks = 0

  for (const [categorySlug, projectsList] of Object.entries(projectsJson)) {
    const categoryId = insertedCategories[categorySlug]
    if (!categoryId) {
      console.warn(`Category '${categorySlug}' not found in categories.json, skipping...`)
      continue
    }

    for (const [pIdx, project] of projectsList.entries()) {
      // Generate unique slug
      let projectSlug = slugify(project.title)
      // Append category to avoid collisions across categories
      projectSlug = `${projectSlug}-${categorySlug}`

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

      // Insert images
      if (project.images?.length) {
        await db.insert(schema.projectImages).values(
          project.images.map((url: string, imgIdx: number) => ({
            projectId: insertedProject.id,
            url: url.split('?')[0], // Remove query params like ?height=600&width=800
            sortOrder: imgIdx,
          }))
        )
      }

      // Insert sections and blocks
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

          // Insert description blocks
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

  // 4. Insert site config
  for (const [key, value] of Object.entries(siteJson)) {
    await db.insert(schema.siteConfig).values({ key, value: String(value) })
  }

  console.log(`Seed complete:`)
  console.log(`  - ${categoriesJson.length} categories`)
  console.log(`  - ${totalProjects} projects`)
  console.log(`  - ${totalSections} sections`)
  console.log(`  - ${totalBlocks} blocks`)
  console.log(`  - ${Object.keys(siteJson).length} site config entries`)

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db/seed.ts
git commit -m "feat: add database seed script to migrate JSON data to Postgres"
```

---

## Phase 4: Auth Infrastructure

### Task 10: Auth session module (cleaned up)

**Files:**
- Create: `src/lib/auth/session.ts`
- Create: `src/__tests__/unit/lib/auth/session.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/__tests__/unit/lib/auth/session.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers cookies
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
}
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

describe('auth/session', () => {
  beforeEach(() => {
    vi.stubEnv('SESSION_SECRET', 'a-very-long-secret-key-that-is-at-least-32-characters-long')
    vi.stubEnv('ADMIN_EMAIL', 'admin@test.com')
    vi.stubEnv('ADMIN_PASSWORD_HASH', '')
    vi.resetModules()
    mockCookieStore.get.mockReset()
    mockCookieStore.set.mockReset()
  })

  it('encrypt produces a valid JWT string', async () => {
    const { encrypt } = await import('@/lib/auth/session')
    const token = await encrypt({ email: 'admin@test.com' })
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
  })

  it('decrypt recovers the payload', async () => {
    const { encrypt, decrypt } = await import('@/lib/auth/session')
    const token = await encrypt({ email: 'admin@test.com' })
    const payload = await decrypt(token)
    expect(payload.email).toBe('admin@test.com')
  })

  it('decrypt throws on invalid token', async () => {
    const { decrypt } = await import('@/lib/auth/session')
    await expect(decrypt('invalid.token.here')).rejects.toThrow()
  })

  it('hashPassword produces consistent SHA-256 hex', async () => {
    const { hashPassword } = await import('@/lib/auth/session')
    const hash1 = await hashPassword('test123')
    const hash2 = await hashPassword('test123')
    expect(hash1).toBe(hash2)
    expect(hash1).toHaveLength(64) // SHA-256 = 64 hex chars
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn vitest run src/__tests__/unit/lib/auth/session.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement session.ts**

```typescript
// src/lib/auth/session.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const getKey = () => {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters')
  }
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getKey())
}

export async function decrypt(token: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] })
  return payload as Record<string, unknown>
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createSession(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  const storedHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !storedHash) return false

  const inputHash = await hashPassword(password)

  if (email !== adminEmail || inputHash !== storedHash) {
    return false
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const token = await encrypt({ email, expires: expires.toISOString() })

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return true
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
}

export async function getSession(): Promise<Record<string, unknown> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null

  try {
    return await decrypt(token)
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn vitest run src/__tests__/unit/lib/auth/session.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/session.ts src/__tests__/unit/lib/auth/session.test.ts
git commit -m "feat: add clean auth session module with JWT, no debug logs"
```

---

### Task 11: Auth guard for Server Actions

**Files:**
- Create: `src/lib/auth/guards.ts`

- [ ] **Step 1: Create guards.ts**

```typescript
// src/lib/auth/guards.ts
import 'server-only'
import { getSession } from './session'

export async function requireAuth(): Promise<Record<string, unknown>> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export function withAuth<TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs) => {
    await requireAuth()
    return action(...args)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth/guards.ts
git commit -m "feat: add withAuth guard wrapper for Server Actions"
```

---

### Task 12: Middleware (refactored)

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create the new middleware**

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth/session'

export async function middleware(request: NextRequest) {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api/admin')

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('session')?.value

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await decrypt(token)
    return NextResponse.next()
  } catch {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

Note: Middleware in Next.js must be at `src/middleware.ts` (not inside `app/`). The `decrypt` import from `@/lib/auth/session` will need to NOT use `server-only` in the middleware context. Create a separate `decrypt` export or move the JWT functions to a file without the `server-only` guard. Alternatively, split `session.ts` into:
- `src/lib/auth/jwt.ts` — pure JWT functions (encrypt/decrypt/hashPassword), no `server-only`
- `src/lib/auth/session.ts` — cookie/session management, `server-only`

Adjust Task 10 accordingly: move `encrypt`, `decrypt`, `hashPassword` to `jwt.ts` and import them in both `session.ts` and `middleware.ts`.

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: refactored middleware with API vs page redirect handling"
```

---

## Phase 5: Feature Domain Types

### Task 13: Project types and schemas

**Files:**
- Create: `src/features/projects/types/project.ts`

- [ ] **Step 1: Create project types**

```typescript
// src/features/projects/types/project.ts
import { z } from 'zod'
import type { projects, projectImages, projectSections, sectionBlocks, categories } from '@/lib/db/schema'

// Inferred from Drizzle schema
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectImage = typeof projectImages.$inferSelect
export type ProjectSection = typeof projectSections.$inferSelect
export type SectionBlock = typeof sectionBlocks.$inferSelect
export type Category = typeof categories.$inferSelect

// With nested relations
export type ProjectWithRelations = Project & {
  category: Category
  images: ProjectImage[]
  sections: (ProjectSection & { blocks: SectionBlock[] })[]
}

export type ProjectWithCategory = Project & {
  category: Category
  images: ProjectImage[]
}

// Form validation schema (for admin forms)
const sectionBlockFormSchema = z.object({
  type: z.string().min(1, 'Block type is required'),
  text: z.string().optional().default(''),
  image: z.string().optional().default(''),
  video: z.string().optional().default(''),
  items: z.array(z.string()).optional(),
})

const sectionFormSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  image: z.string().optional().default(''),
  video: z.string().optional().default(''),
  blocks: z.array(sectionBlockFormSchema).default([]),
})

export const projectFormSchema = z.object({
  categoryId: z.number({ required_error: 'Category is required' }),
  title: z.string().min(1, 'Title is required'),
  role: z.string().optional().default(''),
  company: z.string().optional().default(''),
  status: z.string().optional().default(''),
  subCategory: z.string().optional().default(''),
  platform: z.array(z.string()).optional().default([]),
  description: z.string().optional().default(''),
  tools: z.string().optional().default(''),
  coverImage: z.string().optional().default(''),
  coverAnimated: z.string().optional().default(''),
  videoUrl: z.string().optional().default(''),
  designUrl: z.string().optional().default(''),
  designBtnLabel: z.string().optional().default(''),
  visible: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  sections: z.array(sectionFormSchema).default([]),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/projects/types/project.ts
git commit -m "feat: define project domain types and Zod form schema"
```

---

### Task 14: Category and auth types

**Files:**
- Create: `src/features/categories/types/category.ts`
- Create: `src/features/auth/types/auth.ts`
- Create: `src/features/site-config/types/site-config.ts`
- Create: `src/types/api.ts`

- [ ] **Step 1: Create category types**

```typescript
// src/features/categories/types/category.ts
import { z } from 'zod'
import type { categories } from '@/lib/db/schema'

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export const categoryFormSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
  label: z.string().min(1, 'Label is required'),
  icon: z.string().min(1, 'Icon is required'),
  visible: z.boolean().optional().default(true),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
```

- [ ] **Step 2: Create auth types**

```typescript
// src/features/auth/types/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

- [ ] **Step 3: Create site-config types**

```typescript
// src/features/site-config/types/site-config.ts
import { z } from 'zod'
import type { siteConfig } from '@/lib/db/schema'

export type SiteConfigEntry = typeof siteConfig.$inferSelect

export const siteConfigFormSchema = z.object({
  heroVideoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
})

export type SiteConfigFormValues = z.infer<typeof siteConfigFormSchema>
```

- [ ] **Step 4: Create API response types**

```typescript
// src/types/api.ts
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }
```

- [ ] **Step 5: Commit**

```bash
git add src/features/categories/types/ src/features/auth/types/ src/features/site-config/types/ src/types/api.ts
git commit -m "feat: define category, auth, site-config types and API response type"
```

---

## Phase 6: Server Actions & Queries

### Task 15: Project queries

**Files:**
- Create: `src/features/projects/api/queries.ts`

- [ ] **Step 1: Create project queries**

```typescript
// src/features/projects/api/queries.ts
'use server'
import 'server-only'
import { db } from '@/lib/db'
import { projects, projectImages, projectSections, sectionBlocks } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export const getPublicProjects = unstable_cache(
  async () => {
    return db.query.projects.findMany({
      where: eq(projects.visible, true),
      with: {
        category: true,
        images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      },
      orderBy: (projects, { asc }) => [asc(projects.sortOrder)],
    })
  },
  ['public-projects'],
  { tags: ['projects'], revalidate: 60 }
)

export const getFeaturedProjects = unstable_cache(
  async () => {
    return db.query.projects.findMany({
      where: and(eq(projects.visible, true), eq(projects.featured, true)),
      with: { category: true },
      orderBy: (projects, { asc }) => [asc(projects.sortOrder)],
    })
  },
  ['featured-projects'],
  { tags: ['projects'] }
)

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
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
  },
  ['project-by-slug'],
  { tags: ['projects'] }
)

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
```

- [ ] **Step 2: Commit**

```bash
git add src/features/projects/api/queries.ts
git commit -m "feat: add project queries with caching and relations"
```

---

### Task 16: Project actions (create, update, delete)

**Files:**
- Create: `src/features/projects/api/actions.ts`

- [ ] **Step 1: Create project actions**

```typescript
// src/features/projects/api/actions.ts
'use server'
import 'server-only'
import { db } from '@/lib/db'
import { projects, projectImages, projectSections, sectionBlocks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'
import { projectFormSchema, type ProjectFormValues } from '../types/project'
import { slugify } from '@/lib/utils'

export const createProject = withAuth(async (data: unknown) => {
  const parsed = projectFormSchema.parse(data)

  const project = await db.transaction(async (tx) => {
    const [newProject] = await tx.insert(projects).values({
      slug: slugify(parsed.title),
      categoryId: parsed.categoryId,
      title: parsed.title,
      role: parsed.role || null,
      company: parsed.company || null,
      status: parsed.status || null,
      subCategory: parsed.subCategory || null,
      platform: parsed.platform,
      description: parsed.description || null,
      tools: parsed.tools || null,
      coverImage: parsed.coverImage || null,
      coverAnimated: parsed.coverAnimated || null,
      videoUrl: parsed.videoUrl || null,
      designUrl: parsed.designUrl || null,
      designBtnLabel: parsed.designBtnLabel || null,
      visible: parsed.visible,
      featured: parsed.featured,
    }).returning()

    if (parsed.images?.length) {
      await tx.insert(projectImages).values(
        parsed.images.map((url, i) => ({
          projectId: newProject.id,
          url,
          sortOrder: i,
        }))
      )
    }

    for (const [sIdx, section] of parsed.sections.entries()) {
      const [newSection] = await tx.insert(projectSections).values({
        projectId: newProject.id,
        title: section.title,
        image: section.image || null,
        video: section.video || null,
        sortOrder: sIdx,
      }).returning()

      if (section.blocks?.length) {
        await tx.insert(sectionBlocks).values(
          section.blocks.map((block, bIdx) => ({
            sectionId: newSection.id,
            type: block.type,
            text: block.text || null,
            image: block.image || null,
            video: block.video || null,
            items: block.items || null,
            sortOrder: bIdx,
          }))
        )
      }
    }

    return newProject
  })

  revalidateTag('projects')
  return { success: true as const, data: project }
})

export const updateProject = withAuth(async (id: number, data: unknown) => {
  const parsed = projectFormSchema.parse(data)

  await db.transaction(async (tx) => {
    await tx.update(projects).set({
      categoryId: parsed.categoryId,
      title: parsed.title,
      slug: slugify(parsed.title),
      role: parsed.role || null,
      company: parsed.company || null,
      status: parsed.status || null,
      subCategory: parsed.subCategory || null,
      platform: parsed.platform,
      description: parsed.description || null,
      tools: parsed.tools || null,
      coverImage: parsed.coverImage || null,
      coverAnimated: parsed.coverAnimated || null,
      videoUrl: parsed.videoUrl || null,
      designUrl: parsed.designUrl || null,
      designBtnLabel: parsed.designBtnLabel || null,
      visible: parsed.visible,
      featured: parsed.featured,
      updatedAt: new Date(),
    }).where(eq(projects.id, id))

    // Replace images
    await tx.delete(projectImages).where(eq(projectImages.projectId, id))
    if (parsed.images?.length) {
      await tx.insert(projectImages).values(
        parsed.images.map((url, i) => ({ projectId: id, url, sortOrder: i }))
      )
    }

    // Replace sections + blocks (cascade handles block deletion)
    await tx.delete(projectSections).where(eq(projectSections.projectId, id))
    for (const [sIdx, section] of parsed.sections.entries()) {
      const [newSection] = await tx.insert(projectSections).values({
        projectId: id,
        title: section.title,
        image: section.image || null,
        video: section.video || null,
        sortOrder: sIdx,
      }).returning()

      if (section.blocks?.length) {
        await tx.insert(sectionBlocks).values(
          section.blocks.map((block, bIdx) => ({
            sectionId: newSection.id,
            type: block.type,
            text: block.text || null,
            image: block.image || null,
            video: block.video || null,
            items: block.items || null,
            sortOrder: bIdx,
          }))
        )
      }
    }
  })

  revalidateTag('projects')
  return { success: true as const }
})

export const deleteProject = withAuth(async (id: number) => {
  await db.delete(projects).where(eq(projects.id, id))
  revalidateTag('projects')
  return { success: true as const }
})

export const toggleProjectField = withAuth(async (id: number, field: 'visible' | 'featured', value: boolean) => {
  await db.update(projects).set({ [field]: value, updatedAt: new Date() }).where(eq(projects.id, id))
  revalidateTag('projects')
  return { success: true as const }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/features/projects/api/actions.ts
git commit -m "feat: add project CRUD server actions with transactions"
```

---

### Task 17: Category queries and actions

**Files:**
- Create: `src/features/categories/api/queries.ts`
- Create: `src/features/categories/api/actions.ts`

- [ ] **Step 1: Create category queries**

```typescript
// src/features/categories/api/queries.ts
'use server'
import 'server-only'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export const getPublicCategories = unstable_cache(
  async () => {
    return db.query.categories.findMany({
      where: eq(categories.visible, true),
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    })
  },
  ['public-categories'],
  { tags: ['categories'] }
)

export async function getAdminCategories() {
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    with: { projects: true },
  })
}
```

- [ ] **Step 2: Create category actions**

```typescript
// src/features/categories/api/actions.ts
'use server'
import 'server-only'
import { db } from '@/lib/db'
import { categories, projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'
import { categoryFormSchema } from '../types/category'

export const createCategory = withAuth(async (data: unknown) => {
  const parsed = categoryFormSchema.parse(data)
  const [category] = await db.insert(categories).values({
    slug: parsed.slug,
    label: parsed.label,
    icon: parsed.icon,
    visible: parsed.visible,
  }).returning()

  revalidateTag('categories')
  return { success: true as const, data: category }
})

export const updateCategory = withAuth(async (id: number, data: unknown) => {
  const parsed = categoryFormSchema.parse(data)
  await db.update(categories).set({
    label: parsed.label,
    icon: parsed.icon,
    visible: parsed.visible,
    updatedAt: new Date(),
  }).where(eq(categories.id, id))

  revalidateTag('categories')
  revalidateTag('projects')
  return { success: true as const }
})

export const deleteCategory = withAuth(async (id: number) => {
  // Check if category has projects
  const categoryProjects = await db.query.projects.findMany({
    where: eq(projects.categoryId, id),
  })

  if (categoryProjects.length > 0) {
    return { success: false as const, error: 'Category has associated projects. Remove them first.' }
  }

  await db.delete(categories).where(eq(categories.id, id))
  revalidateTag('categories')
  return { success: true as const }
})
```

- [ ] **Step 3: Commit**

```bash
git add src/features/categories/api/
git commit -m "feat: add category queries and actions"
```

---

### Task 18: Auth actions, site-config, and upload service

**Files:**
- Create: `src/features/auth/api/actions.ts`
- Create: `src/features/site-config/api/queries.ts`
- Create: `src/features/site-config/api/actions.ts`
- Create: `src/lib/storage/vercel-blob.ts`

- [ ] **Step 1: Create auth actions**

```typescript
// src/features/auth/api/actions.ts
'use server'
import 'server-only'
import { createSession, destroySession } from '@/lib/auth/session'
import { loginSchema } from '../types/auth'
import { redirect } from 'next/navigation'

export async function loginAction(data: unknown) {
  const parsed = loginSchema.parse(data)
  const success = await createSession(parsed.email, parsed.password)

  if (!success) {
    return { error: 'Invalid credentials' }
  }

  redirect('/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/login')
}
```

- [ ] **Step 2: Create site-config queries**

```typescript
// src/features/site-config/api/queries.ts
'use server'
import 'server-only'
import { db } from '@/lib/db'
import { siteConfig } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export const getSiteConfig = unstable_cache(
  async () => {
    const entries = await db.query.siteConfig.findMany()
    return Object.fromEntries(entries.map((e) => [e.key, e.value]))
  },
  ['site-config'],
  { tags: ['site-config'] }
)

export async function getSiteConfigValue(key: string): Promise<string | null> {
  const entry = await db.query.siteConfig.findFirst({
    where: eq(siteConfig.key, key),
  })
  return entry?.value ?? null
}
```

- [ ] **Step 3: Create site-config actions**

```typescript
// src/features/site-config/api/actions.ts
'use server'
import 'server-only'
import { db } from '@/lib/db'
import { siteConfig } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'

export const updateSiteConfig = withAuth(async (key: string, value: string) => {
  const existing = await db.query.siteConfig.findFirst({
    where: eq(siteConfig.key, key),
  })

  if (existing) {
    await db.update(siteConfig)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteConfig.key, key))
  } else {
    await db.insert(siteConfig).values({ key, value })
  }

  revalidateTag('site-config')
  return { success: true as const }
})
```

- [ ] **Step 4: Create upload service**

```typescript
// src/lib/storage/vercel-blob.ts
import 'server-only'
import { put } from '@vercel/blob'

export async function uploadFile(file: File): Promise<string> {
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`

  const blob = await put(filename, file, {
    access: 'public',
  })

  return blob.url
}
```

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/api/ src/features/site-config/api/ src/lib/storage/
git commit -m "feat: add auth, site-config actions, and Vercel Blob upload service"
```

---

### Task 19: Feature barrel exports

**Files:**
- Create: `src/features/projects/index.ts`
- Create: `src/features/categories/index.ts`
- Create: `src/features/auth/index.ts`
- Create: `src/features/site-config/index.ts`
- Create: `src/features/hero/index.ts`
- Create: `src/features/about/index.ts`
- Create: `src/features/contact/index.ts`

- [ ] **Step 1: Create barrel exports for each feature**

```typescript
// src/features/projects/index.ts
export { getPublicProjects, getFeaturedProjects, getProjectBySlug, getAdminProjects, getAdminProjectById } from './api/queries'
export { createProject, updateProject, deleteProject, toggleProjectField } from './api/actions'
export type { Project, ProjectWithRelations, ProjectWithCategory, ProjectFormValues } from './types/project'
export { projectFormSchema } from './types/project'
```

```typescript
// src/features/categories/index.ts
export { getPublicCategories, getAdminCategories } from './api/queries'
export { createCategory, updateCategory, deleteCategory } from './api/actions'
export type { Category, CategoryFormValues } from './types/category'
export { categoryFormSchema } from './types/category'
```

```typescript
// src/features/auth/index.ts
export { loginAction, logoutAction } from './api/actions'
export type { LoginFormValues } from './types/auth'
export { loginSchema } from './types/auth'
```

```typescript
// src/features/site-config/index.ts
export { getSiteConfig, getSiteConfigValue } from './api/queries'
export { updateSiteConfig } from './api/actions'
export type { SiteConfigFormValues } from './types/site-config'
export { siteConfigFormSchema } from './types/site-config'
```

```typescript
// src/features/hero/index.ts
// Components will be added in Phase 7
```

```typescript
// src/features/about/index.ts
// Components will be added in Phase 7
```

```typescript
// src/features/contact/index.ts
// Components will be added in Phase 7
```

- [ ] **Step 2: Commit**

```bash
git add src/features/*/index.ts
git commit -m "feat: add barrel exports for all features"
```

---

## Phase 7: Shared Components

### Task 20: Layout components (header, footer, admin sidebar)

**Files:**
- Create: `src/components/layouts/public-header.tsx`
- Create: `src/components/layouts/admin-sidebar.tsx`

- [ ] **Step 1: Create public header**

Port the existing `components/header.tsx` into `src/components/layouts/public-header.tsx`. This component stays as `'use client'` because it uses `useState` for scroll detection and mobile menu. Import `publicNav` from `@/config/navigation` instead of hardcoding links. Replace inline SVG hamburger with `Menu` and `X` from lucide-react. Keep all existing styling and behavior.

- [ ] **Step 2: Create admin sidebar**

Extract the admin navigation from the current admin layout. Create a sidebar component that uses `adminNav` from `@/config/navigation`. Include:
- Logo at the top
- Navigation links with icons (use lucide-react)
- Active state based on `usePathname()`
- Logout button at the bottom calling `logoutAction`
- Mobile responsive (collapsible)

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/
git commit -m "feat: add public header and admin sidebar layout components"
```

---

### Task 21: Shared form and common components

**Files:**
- Create: `src/components/forms/field.tsx`
- Create: `src/components/forms/link-field.tsx`
- Create: `src/components/forms/image-upload.tsx`
- Create: `src/components/common/stat-card.tsx`
- Create: `src/components/common/loading-skeleton.tsx`
- Create: `src/components/common/empty-state.tsx`
- Create: `src/components/common/confirm-dialog.tsx`

- [ ] **Step 1: Create Field component**

Port `Field` from `app/admin/page.tsx:93-101`:

```typescript
// src/components/forms/field.tsx
'use client'
import { Label } from '@/components/ui/label'
import type { ReactNode } from 'react'

interface FieldProps {
  label?: string
  error?: string
  children: ReactNode
}

export function Field({ label, children, error }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {children}
      {label && (
        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {label}
        </Label>
      )}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Create LinkField component**

Port `LinkField` from `app/admin/page.tsx:103-132`. Add proper types, replace `any`. Keep all styling.

- [ ] **Step 3: Create ImageUpload component**

Generic image upload component using `uploadFile` from `@/lib/storage/vercel-blob`. Show preview, loading state, accept image/gif/video.

- [ ] **Step 4: Create StatCard component**

Port `StatCard` from `app/admin/page.tsx:79-91`. Replace `any` with proper props interface.

- [ ] **Step 5: Create LoadingSkeleton**

```typescript
// src/components/common/loading-skeleton.tsx
import { Loader2 } from 'lucide-react'

export function LoadingSkeleton({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      {message && <p className="text-zinc-500 text-sm font-medium">{message}</p>}
    </div>
  )
}
```

- [ ] **Step 6: Create EmptyState**

```typescript
// src/components/common/empty-state.tsx
import { XCircle } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-24">
      {icon ?? <XCircle className="w-10 h-10 text-zinc-800" />}
      <p className="text-zinc-600 font-medium">{title}</p>
      {description && <p className="text-zinc-700 text-sm">{description}</p>}
    </div>
  )
}
```

- [ ] **Step 7: Create ConfirmDialog**

```typescript
// src/components/common/confirm-dialog.tsx
'use client'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  loading?: boolean
  variant?: 'destructive' | 'default'
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading, variant = 'destructive' }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-3xl">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Trash2 className="w-8 h-8" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-black text-white tracking-tighter mb-2">{title}</DialogTitle>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        <DialogFooter className="flex items-center gap-3 mt-8">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 h-12 rounded-xl">Cancel</Button>
          <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/forms/ src/components/common/
git commit -m "feat: add shared form and common components extracted from admin"
```

---

## Phase 8: Feature Components

### Task 22: Project feature components (public)

**Files:**
- Create: `src/features/projects/components/project-card.tsx`
- Create: `src/features/projects/components/project-grid.tsx`
- Create: `src/features/projects/components/project-detail.tsx`
- Create: `src/features/projects/components/project-gallery.tsx`
- Create: `src/features/projects/components/section-renderer.tsx`

- [ ] **Step 1: Port ProjectCard**

Port from `components/project-card.tsx`. Replace `any` with typed props from `ProjectWithCategory`. Update the `Link` href to use `/project/${project.slug}` instead of query params.

- [ ] **Step 2: Create ProjectGrid**

Extract the category tabs + grid from `components/projects-section.tsx`. Receive `projects` and `categories` as props (Server Component can pass them down). The tabs + sliding indicator logic stays `'use client'`.

- [ ] **Step 3: Create ProjectDetail**

Port the left sidebar (project info) from `app/project/page.tsx:96-201`. Typed props, no `any`. Navigation uses slug-based URLs.

- [ ] **Step 4: Create ProjectGallery**

Port the lightbox/gallery from `app/project/page.tsx:354-426`. Separate `'use client'` component for lightbox state.

- [ ] **Step 5: Create SectionRenderer**

Port the section rendering logic from `app/project/page.tsx:220-352`. Maps `SectionBlock` types to React elements. No `any`.

- [ ] **Step 6: Commit**

```bash
git add src/features/projects/components/
git commit -m "feat: add public project components (card, grid, detail, gallery, sections)"
```

---

### Task 23: Project feature components (admin form)

**Files:**
- Create: `src/features/projects/components/project-table.tsx`
- Create: `src/features/projects/components/project-form/index.tsx`
- Create: `src/features/projects/components/project-form/overview-tab.tsx`
- Create: `src/features/projects/components/project-form/content-tab.tsx`
- Create: `src/features/projects/components/project-form/section-editor.tsx`
- Create: `src/features/projects/hooks/use-project-form.ts`

- [ ] **Step 1: Create ProjectTable**

Port from `app/admin/page.tsx:495-643`. Receives typed `projects` array. Uses `toggleProjectField` server action for visibility/featured toggles. Links to `/admin/projects/[id]/edit` instead of opening a dialog.

- [ ] **Step 2: Create useProjectForm hook**

Extract form logic from `app/admin/page.tsx:209-356`. Encapsulates `useForm`, `useFieldArray`, upload handlers, section management. Returns form methods and handlers.

- [ ] **Step 3: Create ProjectForm index (tab orchestrator)**

Port the dialog shell from `app/admin/page.tsx:645-712`. Now it's a full page component (not a dialog). Uses `ChevronTabs` to switch between Overview, Content, Section tabs. Calls `createProject` or `updateProject` server actions on submit.

- [ ] **Step 4: Create OverviewTab**

Port from `app/admin/page.tsx:717-865`. Cover preview, metadata fields. Uses shared `Field` and `LinkField` components.

- [ ] **Step 5: Create ContentTab**

Port from `app/admin/page.tsx:867-960`. Section list table with add/edit/remove. Uses `useFieldArray` from parent form.

- [ ] **Step 6: Create SectionEditor**

Port from the section editing logic (`app/admin/page.tsx:960+`). Description block management, inline upload for section images.

- [ ] **Step 7: Commit**

```bash
git add src/features/projects/components/ src/features/projects/hooks/
git commit -m "feat: decompose admin project form into focused components"
```

---

### Task 24: Category, auth, hero, about, contact components

**Files:**
- Create: `src/features/categories/components/category-list.tsx`
- Create: `src/features/categories/components/category-form.tsx`
- Create: `src/features/auth/components/login-form.tsx`
- Create: `src/features/hero/components/video-hero.tsx`
- Create: `src/features/about/components/about-section.tsx`
- Create: `src/features/contact/components/contact-section.tsx`

- [ ] **Step 1: Port CategoryList + CategoryForm**

Port from `app/admin/categories/page.tsx`. Split into list (server data) and form (`'use client'` dialog). Use `createCategory`, `updateCategory`, `deleteCategory` actions.

- [ ] **Step 2: Port LoginForm**

Port from `app/login/page.tsx`. Use `loginAction` server action. Use `loginSchema` from `@/features/auth`. Keep all styling.

- [ ] **Step 3: Port VideoHero**

Copy from `components/video-hero.tsx` to `src/features/hero/components/video-hero.tsx`. No changes needed — it's already clean (16 lines).

- [ ] **Step 4: Port AboutSection**

Port from `components/about-section.tsx`. Keep as `'use client'` (tab state, animation). Import `siteConfig` from `@/config/site` for resume URL.

- [ ] **Step 5: Port ContactSection**

Port from `components/contact-section.tsx`. Import social links from `siteConfig` instead of hardcoding.

- [ ] **Step 6: Update feature barrel exports**

Add component exports to each feature's `index.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/features/categories/components/ src/features/auth/components/ src/features/hero/ src/features/about/ src/features/contact/
git commit -m "feat: port all remaining feature components"
```

---

## Phase 9: Pages & Routing

### Task 25: Root layout and marketing pages

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/app/(marketing)/project/[slug]/page.tsx`

- [ ] **Step 1: Create root layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.title}`,
  description: siteConfig.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create not-found and error pages**

Simple styled pages matching the existing dark theme.

- [ ] **Step 3: Create marketing layout**

```typescript
// src/app/(marketing)/layout.tsx
import { PublicHeader } from '@/components/layouts/public-header'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
    </>
  )
}
```

- [ ] **Step 4: Create home page (Server Component)**

```typescript
// src/app/(marketing)/page.tsx
import { getFeaturedProjects } from '@/features/projects'
import { getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { getSiteConfigValue } from '@/features/site-config'
import { VideoHero } from '@/features/hero'
import { ProjectGrid } from '@/features/projects'
import { AboutSection } from '@/features/about'
import { ContactSection } from '@/features/contact'
import { FeaturedProjectsSection } from '@/features/projects'
import Link from 'next/link'

export default async function HomePage() {
  const [featured, projects, categories, heroVideoUrl] = await Promise.all([
    getFeaturedProjects(),
    getPublicProjects(),
    getPublicCategories(),
    getSiteConfigValue('heroVideoUrl'),
  ])

  const defaultVideo = 'https://www.youtube.com/embed/mzg3fhwPQQc?si=014MDzNOCnpXGT15&autoplay=1&mute=1&loop=1&playlist=mzg3fhwPQQc'

  return (
    <main className="min-h-screen bg-black text-white">
      <section id="hero" className="min-h-screen relative flex flex-col items-center justify-between">
        <div className="text-center gradient-bg w-full flex-1 flex items-end justify-center">
          <div className="w-full flex flex-col items-center mb-5">
            <Link
              href="#projects"
              className="cursor-pointer z-50 px-6 py-3 border border-[#0099ff] bg-[#0099ff] text-white rounded-md hover:bg-[#0099ff] hover:bg-opacity-10 transition-colors inline-flex items-center justify-center"
            >
              View Projects
            </Link>
          </div>
        </div>
        <VideoHero src={heroVideoUrl || defaultVideo} />
      </section>

      {featured.length > 0 && (
        <FeaturedProjectsSection projects={featured} />
      )}

      <ProjectGrid projects={projects} categories={categories} />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
```

- [ ] **Step 5: Create project detail page**

```typescript
// src/app/(marketing)/project/[slug]/page.tsx
import { getProjectBySlug } from '@/features/projects'
import { ProjectDetail } from '@/features/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return <ProjectDetail project={project} />
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/not-found.tsx src/app/error.tsx src/app/\(marketing\)/
git commit -m "feat: create marketing pages with Server Components"
```

---

### Task 26: Auth and dashboard pages

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(dashboard)/admin/page.tsx`
- Create: `src/app/(dashboard)/admin/projects/page.tsx`
- Create: `src/app/(dashboard)/admin/projects/new/page.tsx`
- Create: `src/app/(dashboard)/admin/projects/[id]/edit/page.tsx`
- Create: `src/app/(dashboard)/admin/categories/page.tsx`
- Create: `src/app/(dashboard)/admin/settings/page.tsx`

- [ ] **Step 1: Create login page**

```typescript
// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-zinc-950 to-zinc-950">
      <LoginForm />
    </div>
  )
}
```

- [ ] **Step 2: Create dashboard layout**

```typescript
// src/app/(dashboard)/layout.tsx
import { AdminSidebar } from '@/components/layouts/admin-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Create admin dashboard (redirect to projects)**

```typescript
// src/app/(dashboard)/admin/page.tsx
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/projects')
}
```

- [ ] **Step 4: Create admin projects list page**

```typescript
// src/app/(dashboard)/admin/projects/page.tsx
import { getAdminProjects } from '@/features/projects'
import { getAdminCategories } from '@/features/categories'
import { ProjectTable } from '@/features/projects'

export default async function AdminProjectsPage() {
  const [projects, categories] = await Promise.all([
    getAdminProjects(),
    getAdminCategories(),
  ])

  return <ProjectTable projects={projects} categories={categories} />
}
```

- [ ] **Step 5: Create new project page**

```typescript
// src/app/(dashboard)/admin/projects/new/page.tsx
import { getAdminCategories } from '@/features/categories'
import { ProjectForm } from '@/features/projects'

export default async function NewProjectPage() {
  const categories = await getAdminCategories()
  return <ProjectForm categories={categories} />
}
```

- [ ] **Step 6: Create edit project page**

```typescript
// src/app/(dashboard)/admin/projects/[id]/edit/page.tsx
import { getAdminProjectById } from '@/features/projects'
import { getAdminCategories } from '@/features/categories'
import { ProjectForm } from '@/features/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const [project, categories] = await Promise.all([
    getAdminProjectById(Number(id)),
    getAdminCategories(),
  ])

  if (!project) notFound()

  return <ProjectForm project={project} categories={categories} />
}
```

- [ ] **Step 7: Create categories and settings pages**

```typescript
// src/app/(dashboard)/admin/categories/page.tsx
import { getAdminCategories } from '@/features/categories'
import { CategoryList } from '@/features/categories'

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()
  return <CategoryList categories={categories} />
}
```

```typescript
// src/app/(dashboard)/admin/settings/page.tsx
import { getSiteConfig } from '@/features/site-config'
import { SettingsForm } from '@/features/site-config'

export default async function AdminSettingsPage() {
  const config = await getSiteConfig()
  return <SettingsForm initialConfig={config} />
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/\(auth\)/ src/app/\(dashboard\)/
git commit -m "feat: create auth and dashboard pages with Server Components"
```

---

### Task 27: Public API routes (for backward compatibility)

**Files:**
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/api/categories/route.ts`
- Create: `src/app/api/site/route.ts`

- [ ] **Step 1: Create slim API routes that delegate to queries**

```typescript
// src/app/api/projects/route.ts
import { getPublicProjects } from '@/features/projects'
import { NextResponse } from 'next/server'

export async function GET() {
  const projects = await getPublicProjects()
  return NextResponse.json(projects)
}
```

```typescript
// src/app/api/categories/route.ts
import { getPublicCategories } from '@/features/categories'
import { NextResponse } from 'next/server'

export async function GET() {
  const categories = await getPublicCategories()
  return NextResponse.json(categories)
}
```

```typescript
// src/app/api/site/route.ts
import { getSiteConfig } from '@/features/site-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const config = await getSiteConfig()
  return NextResponse.json(config)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/
git commit -m "feat: add thin public API routes delegating to feature queries"
```

---

## Phase 10: Testing

### Task 28: Test factories

**Files:**
- Create: `src/__tests__/helpers/factories/project.factory.ts`
- Create: `src/__tests__/helpers/factories/category.factory.ts`

- [ ] **Step 1: Create factories**

```typescript
// src/__tests__/helpers/factories/project.factory.ts
import { faker } from '@faker-js/faker'
import type { NewProject } from '@/lib/db/schema/projects'

export function buildProject(overrides?: Partial<NewProject>): NewProject {
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
```

```typescript
// src/__tests__/helpers/factories/category.factory.ts
import { faker } from '@faker-js/faker'
import type { NewCategory } from '@/lib/db/schema/categories'

export function buildCategory(overrides?: Partial<NewCategory>): NewCategory {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/__tests__/helpers/factories/
git commit -m "feat: add test data factories for projects and categories"
```

---

### Task 29: E2E tests

**Files:**
- Create: `src/__tests__/e2e/auth.spec.ts`
- Create: `src/__tests__/e2e/public-navigation.spec.ts`
- Create: `src/__tests__/e2e/admin-projects.spec.ts`

- [ ] **Step 1: Create auth e2e test**

```typescript
// src/__tests__/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('redirects to login when accessing /admin without session', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('redirects to admin after successful login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', process.env.ADMIN_EMAIL!)
    await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/)
  })
})
```

- [ ] **Step 2: Create public navigation e2e test**

```typescript
// src/__tests__/e2e/public-navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Public Navigation', () => {
  test('home page loads with hero and projects', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View Projects')).toBeVisible()
    await expect(page.locator('#projects')).toBeVisible()
  })

  test('clicking a project card navigates to project detail', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('[data-testid="project-card"]').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/project\//)
  })

  test('project detail page shows project info', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('[data-testid="project-card"]').first()
    await firstCard.click()
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

- [ ] **Step 3: Create admin projects e2e test**

```typescript
// src/__tests__/e2e/admin-projects.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin Projects', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', process.env.ADMIN_EMAIL!)
    await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('projects list loads', async ({ page }) => {
    await page.goto('/admin/projects')
    await expect(page.locator('table')).toBeVisible()
  })

  test('can navigate to new project form', async ({ page }) => {
    await page.goto('/admin/projects')
    await page.click('text=New Project')
    await expect(page).toHaveURL(/\/admin\/projects\/new/)
  })
})
```

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/e2e/
git commit -m "feat: add e2e tests for auth, navigation, and admin flows"
```

---

## Phase 11: Cleanup & Migration

### Task 30: Remove old files and verify build

**Files:**
- Delete: Old `app/` directory
- Delete: Old `components/` (non-ui)
- Delete: `data/` directory
- Delete: Old `hooks/`, `lib/`, `middleware.ts`
- Delete: `public/Projects-Content.ts` or `public/Projects-Content/`

- [ ] **Step 1: Verify the new src/ app builds successfully**

```bash
yarn next build
```

Expected: Build succeeds with no errors. If there are import errors, fix them before proceeding.

- [ ] **Step 2: Remove old app directory**

```bash
rm -rf app/
```

- [ ] **Step 3: Remove old components (keep ui/ was already copied)**

```bash
rm -f components/header.tsx components/video-hero.tsx components/projects-section.tsx components/project-card.tsx components/about-section.tsx components/contact-section.tsx components/theme-provider.tsx
```

- [ ] **Step 4: Remove old data, hooks, lib, middleware**

```bash
rm -rf data/
rm -rf hooks/
rm -rf lib/
rm -f middleware.ts
```

- [ ] **Step 5: Remove old components directory if empty**

```bash
rmdir components/ 2>/dev/null || true
```

- [ ] **Step 6: Verify build still passes**

```bash
yarn next build
```

- [ ] **Step 7: Run all tests**

```bash
yarn test
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: remove old files after migration to src/ architecture"
```

---

### Task 31: Database setup and seed (production)

This task is done manually or via CI, not code:

- [ ] **Step 1: Create Vercel Postgres database**

In Vercel dashboard: Storage → Create → Postgres. Copy the `POSTGRES_URL` to `.env.local`.

- [ ] **Step 2: Generate and run migrations**

```bash
yarn db:generate
yarn db:push
```

- [ ] **Step 3: Run seed to migrate JSON data**

```bash
yarn db:seed
```

- [ ] **Step 4: Verify data in Drizzle Studio**

```bash
yarn db:studio
```

Check that all categories, projects, sections, blocks, and site config entries are present.

- [ ] **Step 5: Set up Vercel Blob**

In Vercel dashboard: Storage → Create → Blob. Copy the `BLOB_READ_WRITE_TOKEN` to `.env.local`.

- [ ] **Step 6: Update environment variables on Vercel**

Add all env vars: `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`.

- [ ] **Step 7: Deploy and verify**

```bash
git push
```

Verify:
- Public pages load with projects from database
- Admin login works
- CRUD operations persist across deploys
- Image uploads work via Vercel Blob

---

### Task 32: Final verification

- [ ] **Step 1: Run full test suite**

```bash
yarn test
yarn test:e2e
```

- [ ] **Step 2: Run type check**

```bash
yarn tsc --noEmit
```

- [ ] **Step 3: Run lint**

```bash
yarn lint
```

- [ ] **Step 4: Manual smoke test**

Verify in browser:
- Home page loads, hero video plays, featured projects show
- Category tabs work, projects filter correctly
- Clicking a project card navigates to `/project/[slug]`
- Project detail shows all sections, images, lightbox works
- About section tabs work, skill bars animate
- Contact section shows email and social links
- Login works with correct credentials
- Admin dashboard shows all projects
- Can create, edit, delete projects
- Can create, edit, delete categories
- Can update settings (hero video URL)
- Image upload works
- Visibility and featured toggles work
- Mobile responsive layout works

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```
