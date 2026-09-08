import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createInquiryMock } = vi.hoisted(() => ({ createInquiryMock: vi.fn() }))

vi.mock('@/lib/inquiry-storage', () => ({ createInquiry: createInquiryMock }))

import { submitInquiry } from '@/app/(frontend)/contact/actions'
import { initialInquiryState } from '@/lib/inquiry-form-state'

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
})
