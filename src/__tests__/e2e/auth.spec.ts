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
    await expect(page.locator('text=Invalid credentials').or(page.locator('text=Credenciais'))).toBeVisible({ timeout: 10000 })
  })
})
