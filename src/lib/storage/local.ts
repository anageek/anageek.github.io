import 'server-only'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function uploadFile(file: File): Promise<{ url: string }> {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filename = `${timestamp}-${safeName}`

  const uploadDir = join(process.cwd(), 'public', 'images', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const filePath = join(uploadDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  return { url: `/images/uploads/${filename}` }
}
