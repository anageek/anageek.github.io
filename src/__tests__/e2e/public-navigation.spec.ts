import { test, expect } from '@playwright/test'

test.describe('Public Navigation', () => {
  test('home page loads with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View Projects')).toBeVisible({ timeout: 15000 })
  })

  test('projects section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#projects')).toBeVisible({ timeout: 15000 })
  })

  test('about section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#about')).toBeVisible({ timeout: 15000 })
  })

  test('contact section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#contact')).toBeVisible({ timeout: 15000 })
  })
})
