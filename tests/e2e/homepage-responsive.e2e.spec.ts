import { expect, test } from '@playwright/test'

test.describe('homepage responsive behavior', () => {
  test('desktop keeps the approved navigation and hero hierarchy', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const desktopNavigation = page.getByRole('navigation', { name: 'التنقل الرئيسي' }).first()
    await expect(desktopNavigation).toBeVisible()
    await expect(desktopNavigation.getByRole('link')).toHaveCount(4)
    await expect(page.getByRole('link', { name: 'اتصل بنا' }).first()).toHaveAttribute('href', 'tel:01031080031')
    await expect(page.getByRole('button', { name: 'القائمة' })).toBeHidden()
    await expect(page.locator('#hero-title')).toBeVisible()
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 1440)
  })

  test('mobile exposes an accessible right-side drawer without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForTimeout(1000)

    const menuButton = page.getByRole('button', { name: 'القائمة', exact: true })
    await expect(menuButton).toBeVisible()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#mobile-navigation')).toBeHidden()

    await menuButton.evaluate((element) => (element as HTMLButtonElement).click())

    await expect(page.locator('#mobile-navigation')).toBeVisible()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#mobile-navigation').getByRole('navigation').getByRole('link')).toHaveCount(4)
    await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'اتصل بنا' })).toHaveAttribute('href', 'tel:01031080031')
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390)
  })

  test('keeps the header actions usable across the requested viewport matrix', async ({ page }) => {
    for (const width of [1440, 1024, 768, 430, 375]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForTimeout(500)

      expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(width)

      if (width >= 900) {
        await expect(page.locator('.site-header__cta')).toBeVisible()
      } else {
        const menuButton = page.getByRole('button', { name: 'القائمة', exact: true })
        await expect(menuButton).toBeVisible()
        await menuButton.evaluate((element) => (element as HTMLButtonElement).click())
        await expect(page.locator('.mobile-drawer__cta')).toBeVisible()
      }
    }
  })
})
