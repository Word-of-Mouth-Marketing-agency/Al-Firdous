import { expect, test } from '@playwright/test'

const productDetailPath = '/products/schwing-pump-part-25-b5637e71'
const primaryWhatsAppNumber = '201031080031'
const generalWhatsAppMessage = 'مرحباً، أريد الاستفسار عن منتجات الفردوس.'

test.describe('page title and WhatsApp refinements', () => {
  test('preview routes load without runtime page errors', async ({ page }) => {
    const runtimeErrors: string[] = []
    page.on('pageerror', (error) => runtimeErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text())
    })

    for (const path of ['/', '/about', '/products', '/contact', productDetailPath]) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    }

    expect(runtimeErrors.join('\n')).not.toMatch(/unhandledRejection|undefined/)
  })

  test('uses compact blue title bands on public inner pages', async ({ page }) => {
    const pages = [
      { path: '/about', title: 'من نحن' },
      { path: '/products', title: 'المنتجات' },
      { path: '/contact', title: 'تواصل معنا' },
      { path: productDetailPath, title: 'حلقة 210 شيفينج' },
    ]

    for (const item of pages) {
      await page.goto(item.path)
      const titleBand = page.locator('.page-title')

      await expect(titleBand).toHaveCount(1)
      await expect(titleBand.locator('h1')).toHaveText(item.title)
      await expect(titleBand.locator('h1')).toHaveCSS('color', 'rgb(255, 255, 255)')
      await expect(titleBand).toHaveCSS('background-color', 'rgb(49, 118, 171)')
      await expect(titleBand.locator('p')).toHaveCount(0)
      await expect(titleBand.locator('.page-kicker')).toHaveCount(0)
    }
  })

  test('renders the canonical floating WhatsApp action site-wide', async ({ page }) => {
    for (const path of ['/', '/about', '/products', '/contact', productDetailPath]) {
      await page.goto(path)

      const whatsapp = page.getByRole('link', { name: 'تواصل معنا عبر واتساب' })
      await expect(whatsapp).toHaveCount(1)

      const href = await whatsapp.getAttribute('href')
      expect(href).toContain(`https://wa.me/${primaryWhatsAppNumber}?text=`)
      expect(new URL(href || '').searchParams.get('text')).toBe(generalWhatsAppMessage)
    }
  })

  test('includes the product name in product inquiry links', async ({ page }) => {
    await page.goto(productDetailPath)

    const inquiry = page.getByRole('link', { name: 'استفسر عبر واتساب' })
    const href = await inquiry.getAttribute('href')

    expect(href).toContain(`https://wa.me/${primaryWhatsAppNumber}?text=`)
    expect(new URL(href || '').searchParams.get('text')).toContain('حلقة 210 شيفينج')
  })

  test('links all six featured products to stable product detail routes', async ({ page }) => {
    await page.goto('/')

    const cards = page.locator('.product-card')
    await expect(cards).toHaveCount(6)

    const hrefs = await cards.locator('a').evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string => Boolean(href))
        .filter((href, index, all) => all.indexOf(href) === index),
    )

    expect(hrefs).toHaveLength(6)
    expect(hrefs.every((href) => /^\/products\/[^/]+$/.test(href))).toBe(true)

    for (const href of hrefs) {
      const response = await page.goto(href)
      expect(response?.status()).toBe(200)
      await expect(page.locator('.page-title h1')).toBeVisible()
    }
  })

  test('uses the approved About wording and Tajawal globally', async ({ page }) => {
    await page.goto('/about')

    await expect(page.getByRole('heading', { name: 'مجالات تخصصنا', level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'الأقسام التي نخدمها', level: 2 })).toHaveCount(0)

    const fontFamily = await page.locator('body').evaluate((element) => getComputedStyle(element).fontFamily)
    expect(fontFamily.toLowerCase()).toContain('tajawal')
  })

  test('opens and closes the accessible right-side mobile drawer', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 844 })
    await page.goto('/about')
    await page.waitForTimeout(1000)

    const trigger = page.getByRole('button', { name: 'القائمة', exact: true })
    const drawer = page.locator('#mobile-navigation')

    await trigger.evaluate((element) => (element as HTMLButtonElement).click())
    await expect(drawer).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(drawer.locator('.mobile-drawer__nav-link')).toHaveCount(4)
    await expect(drawer.getByRole('link', { name: 'اتصل بنا' })).toHaveAttribute('href', 'tel:01031080031')
    await expect(drawer.locator('.mobile-drawer__close')).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await drawer.locator('.mobile-drawer__brand').focus()
    await page.keyboard.press('Shift+Tab')
    await expect(drawer.locator('.mobile-drawer__cta')).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

    await trigger.evaluate((element) => (element as HTMLButtonElement).click())
    await page.locator('.mobile-drawer__backdrop').click({ position: { x: 4, y: 4 } })
    await expect(drawer).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('keeps WhatsApp bottom-right and on the canonical number', async ({ page }) => {
    for (const width of [1440, 768, 430, 375]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')

      const whatsapp = page.getByRole('link', { name: 'تواصل معنا عبر واتساب' })
      await expect(whatsapp).toHaveAttribute('href', /wa\.me\/201031080031/)

      const position = await whatsapp.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return { right: window.innerWidth - rect.right, left: rect.left }
      })

      expect(position.right).toBeGreaterThan(0)
      expect(position.right).toBeLessThan(40)
      expect(position.left).toBeGreaterThan(width / 2)
    }
  })
})
