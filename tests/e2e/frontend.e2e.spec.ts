import { expect, test } from '@playwright/test'

test.describe('public route shells', () => {
  for (const route of ['/', '/about', '/products', '/contact']) {
    test(`${route} renders in Arabic RTL`, async ({ page }) => {
      await page.goto(route)

      await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})
