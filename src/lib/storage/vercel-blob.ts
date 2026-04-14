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
