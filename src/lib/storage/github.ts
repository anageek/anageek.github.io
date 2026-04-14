import 'server-only'

interface GitHubUploadResult {
  url: string
  path: string
}

/**
 * Uploads a file to the GitHub repository by creating a commit.
 * The file is saved to public/images/uploads/ in the repo.
 * After Vercel rebuilds (~1-2 min), the image is available at the URL.
 */
export async function uploadFile(file: File): Promise<GitHubUploadResult> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO

  if (!token || !repo) {
    throw new Error('GITHUB_TOKEN and GITHUB_REPO must be configured')
  }

  // Generate unique filename
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filename = `${timestamp}-${safeName}`
  const repoPath = `public/images/uploads/${filename}`

  // Read file as base64
  const buffer = await file.arrayBuffer()
  const base64Content = Buffer.from(buffer).toString('base64')

  // Commit file via GitHub Contents API
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${repoPath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `upload: ${filename}`,
        content: base64Content,
        branch: 'main',
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`GitHub upload failed: ${response.status} ${JSON.stringify(error)}`)
  }

  // Return the public URL path (relative to site root)
  const publicUrl = `/images/uploads/${filename}`

  return {
    url: publicUrl,
    path: repoPath,
  }
}
