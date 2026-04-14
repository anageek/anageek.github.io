import { test, expect } from '@playwright/test'

test.describe('Admin Projects', () => {
  test('admin page redirects to login without auth', async ({ page }) => {
    await page.goto('/admin/projects')
    await expect(page).toHaveURL(/\/login/)
  })

  test('new project page redirects to login without auth', async ({ page }) => {
    await page.goto('/admin/projects/new')
    await expect(page).toHaveURL(/\/login/)
  })

  test('categories page redirects to login without auth', async ({ page }) => {
    await page.goto('/admin/categories')
    await expect(page).toHaveURL(/\/login/)
  })

  test('settings page redirects to login without auth', async ({ page }) => {
    await page.goto('/admin/settings')
    await expect(page).toHaveURL(/\/login/)
  })
})
