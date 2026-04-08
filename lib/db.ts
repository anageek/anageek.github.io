import { promises as fs } from 'fs';
import path from 'path';

const useKV = !!process.env.KV_REST_API_URL;

// Lazy import to avoid breaking local dev without KV env vars
async function kv() {
  const { kv } = await import('@vercel/kv');
  return kv;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<any[]> {
  if (useKV) {
    const db = await kv();
    return (await db.get<any[]>('categories')) ?? [];
  }
  const data = await fs.readFile(path.join(process.cwd(), 'data/categories.json'), 'utf8');
  return JSON.parse(data);
}

export async function saveCategories(categories: any[]): Promise<void> {
  if (useKV) {
    const db = await kv();
    await db.set('categories', categories);
    return;
  }
  await fs.writeFile(path.join(process.cwd(), 'data/categories.json'), JSON.stringify(categories, null, 2), 'utf8');
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Record<string, any[]>> {
  if (useKV) {
    const db = await kv();
    return (await db.get<Record<string, any[]>>('projects')) ?? {};
  }
  const data = await fs.readFile(path.join(process.cwd(), 'data/projects.json'), 'utf8');
  return JSON.parse(data);
}

export async function saveProjects(projects: Record<string, any[]>): Promise<void> {
  if (useKV) {
    const db = await kv();
    await db.set('projects', projects);
    return;
  }
  await fs.writeFile(path.join(process.cwd(), 'data/projects.json'), JSON.stringify(projects, null, 2), 'utf8');
}

// ─── Site config ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<Record<string, any>> {
  if (useKV) {
    const db = await kv();
    return (await db.get<Record<string, any>>('site')) ?? {};
  }
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data/site.json'), 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function saveSiteConfig(config: Record<string, any>): Promise<void> {
  if (useKV) {
    const db = await kv();
    await db.set('site', config);
    return;
  }
  await fs.writeFile(path.join(process.cwd(), 'data/site.json'), JSON.stringify(config, null, 2), 'utf8');
}
