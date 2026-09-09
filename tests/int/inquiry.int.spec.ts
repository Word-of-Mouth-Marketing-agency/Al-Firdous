import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createInquiryMock, headersMock } = vi.hoisted(() => ({ createInquiryMock: vi.fn(), headersMock: vi.fn() }))

vi.mock('@/lib/inquiry-storage', () => ({ createInquiry: createInquiryMock }))
vi.mock('next/headers', () => ({ headers: headersMock }))

import { submitInquiry } from '@/app/(frontend)/contact/actions'
import { initialInquiryState } from '@/lib/inquiry-form-state'
import { resetInquiryRateLimitForTests } from '@/lib/inquiry-rate-limit'

function validForm() {
  const form = new FormData()
  form.set('name', 'عميل تجريبي')
  form.set('phone', '01031080031')
  form.set('subject', 'جلبة 120')
  form.set('message', 'أرغب في معرفة توفر هذه القطعة.')
  return form
}

describe('contact inquiry submission', () => {
  beforeEach(() => {
    createInquiryMock.mockReset()
    headersMock.mockResolvedValue(new Headers())
    resetInquiryRateLimitForTests()
  })

  it('reports success only after the Payload storage call resolves', async () => {
    createInquiryMock.mockResolvedValueOnce({ id: 1 })

    const result = await submitInquiry(initialInquiryState, validForm())

    expect(result.status).toBe('success')
    expect(result.values).toEqual({ name: '', phone: '', subject: '', message: '' })
    expect(createInquiryMock).toHaveBeenCalledWith({
      name: 'عميل تجريبي',
      phone: '01031080031',
      subject: 'جلبة 120',
      message: 'أرغب في معرفة توفر هذه القطعة.',
      source: 'contact-form',
    })
  })

  it('preserves values and reports an error when storage fails', async () => {
    createInquiryMock.mockRejectedValueOnce(new Error('database unavailable'))

    const result = await submitInquiry(initialInquiryState, validForm())

    expect(result.status).toBe('error')
    expect(result.message).toContain('تعذر حفظ الاستفسار')
    expect(result.values.name).toBe('عميل تجريبي')
    expect(result.values.phone).toBe('01031080031')
  })

  it('rejects invalid Egyptian phone numbers before storage', async () => {
    const form = validForm()
    form.set('phone', '123')

    const result = await submitInquiry(initialInquiryState, form)

    expect(result.status).toBe('error')
    expect(result.message).toContain('رقم هاتف مصري')
    expect(createInquiryMock).not.toHaveBeenCalled()
  })

  it('does not claim or attempt to save inquiries in preview mode', async () => {
    const original = process.env.HOMEPAGE_PREVIEW_CONTENT
    process.env.HOMEPAGE_PREVIEW_CONTENT = 'true'

    try {
      const result = await submitInquiry(initialInquiryState, validForm())

      expect(result.status).toBe('error')
      expect(result.message).toContain('المعاينة المحلية')
      expect(createInquiryMock).not.toHaveBeenCalled()
    } finally {
      if (original === undefined) delete process.env.HOMEPAGE_PREVIEW_CONTENT
      else process.env.HOMEPAGE_PREVIEW_CONTENT = original
    }
  })

  it('limits the sixth inquiry from the same client during the active window', async () => {
    createInquiryMock.mockResolvedValue({ id: 1 })
    const requestHeaders = new Headers({ 'x-forwarded-for': '203.0.113.10' })
    headersMock.mockResolvedValue(requestHeaders)
    const originalTrustProxy = process.env.TRUST_PROXY
    process.env.TRUST_PROXY = 'true'

    try {
      const results = await Promise.all(Array.from({ length: 6 }, () => submitInquiry(initialInquiryState, validForm())))
      expect(results.slice(0, 5).every((result) => result.status === 'success')).toBe(true)
      expect(results[5].status).toBe('error')
      expect(results[5].message).toContain('عدد كبير من الطلبات')
      expect(createInquiryMock).toHaveBeenCalledTimes(5)
    } finally {
      if (originalTrustProxy === undefined) delete process.env.TRUST_PROXY
      else process.env.TRUST_PROXY = originalTrustProxy
    }
  })
})
