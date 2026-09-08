import { expect, test } from '@playwright/test'

const productDetailPath = '/products/schwing-pump-part-25-b5637e71'
const primaryWhatsAppNumber = '201031080031'
const generalWhatsAppMessage = 'مرحباً، أريد الاستفسار عن منتجات الفردوس.'

test.describe('page title and WhatsApp refinements', () => {
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
})
