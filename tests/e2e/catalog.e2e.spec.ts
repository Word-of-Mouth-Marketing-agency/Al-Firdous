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
    await page.goto('/products/schwing-pump-part-25-b5637e71')
    await expect(page.getByRole('heading', { name: 'حلقة 210 شيفينج', level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'استفسر عبر واتساب' })).toHaveAttribute('href', /wa\.me/)
    await expect(page.getByText('لا توجد صورة')).toHaveCount(0)
  })

  test('shows confirmed contact records without inventing an address or email', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'تواصل معنا', level: 1 })).toBeVisible()
    await expect(page.getByText('عبدالرحمن')).toBeVisible()
    await expect(page.getByRole('link', { name: '01031080031' })).toBeVisible()
    await expect(page.getByText('البريد الإلكتروني')).toHaveCount(0)
    await expect(page.getByText('العنوان')).toHaveCount(0)
  })

  test('shows the production inquiry form with browser validation', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'أرسل تفاصيل طلبك', level: 2 })).toBeVisible()

    const form = page.locator('form.contact-form')
    await form.getByRole('button', { name: 'إرسال الاستفسار' }).click()
    expect(await form.locator('input[name="name"]').evaluate((element) => (element as HTMLInputElement).validity.valueMissing)).toBe(true)

    await form.locator('input[name="name"]').fill('عميل')
    await form.locator('input[name="phone"]').fill('01234567890')
    await form.locator('textarea[name="message"]').fill('أحتاج الاستفسار عن قطعة غيار')
    await form.getByRole('button', { name: 'إرسال الاستفسار' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.locator('.contact-form__error')).toContainText('تعذر حفظ الاستفسار')
  })
})
