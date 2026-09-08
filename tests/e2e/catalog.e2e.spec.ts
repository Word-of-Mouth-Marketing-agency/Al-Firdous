import { expect, test } from '@playwright/test'

test.describe('catalog and public information pages', () => {
  test('searches and filters the catalog without commerce UI', async ({ page }) => {
    await page.goto('/products?q=بطارية&brand=schwing')
    await expect(page.getByRole('heading', { name: 'المنتجات', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'بطارية صغيرة شيفينج', level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'بطارية كبيرة شيفينج', level: 2 })).toBeVisible()
    await expect(page.getByText('السعر')).toHaveCount(0)
    await expect(page.getByText('إضافة إلى السلة')).toHaveCount(0)
  })

  test('opens a product detail page with inquiry actions', async ({ page }) => {
    await page.goto('/products/schwing-pump-part-23-b5637e71')
    await expect(page.getByRole('heading', { name: 'حلقة 210 شيفينج', level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'استفسر عبر واتساب' })).toHaveAttribute('href', /wa\.me/)
    await expect(page.getByText('لا توجد صورة')).toHaveCount(0)
  })

  test('shows confirmed contact records without inventing an address or email', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'تواصل معنا', level: 1 })).toBeVisible()
    await expect(page.getByText('عبدالرحمن')).toBeVisible()
    await expect(page.getByText('01031080031')).toBeVisible()
    await expect(page.getByText('البريد الإلكتروني')).toHaveCount(0)
    await expect(page.getByText('العنوان')).toHaveCount(0)
  })
})
