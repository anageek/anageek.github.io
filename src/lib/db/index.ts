import 'server-only'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { join } from 'path'

const dbPath = join(process.cwd(), 'data', 'portfolio.db')
const sqlite = new Database(dbPath)

// Enable WAL mode for better concurrent read performance
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })

export type DatabaseType = typeof db
