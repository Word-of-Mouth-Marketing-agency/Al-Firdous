import { expect, test } from '@playwright/test'

test.describe('homepage responsive behavior', () => {
  test('desktop keeps the approved navigation and hero hierarchy', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    await expect(page.getByRole('navigation', { name: 'التنقل الرئيسي' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'القائمة' })).toBeHidden()
    await expect(page.locator('#hero-title')).toBeVisible()
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 1440)
  })

  test('mobile exposes an accessible menu without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForTimeout(1000)

    const menuButton = page.locator('summary.site-header__menu-button')
    await expect(menuButton).toBeVisible()
    await expect(page.locator('#mobile-navigation')).toBeHidden()

    await menuButton.click()

    await expect(page.locator('#mobile-navigation')).toBeVisible()
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390)
  })
})
