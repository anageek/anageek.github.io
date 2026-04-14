import { getPublicCategories } from '@/features/categories'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await getPublicCategories()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
