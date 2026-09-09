'use server'

import { createInquiry } from '@/lib/inquiry-storage'
import type { InquiryState } from '@/lib/inquiry-form-state'
import { validateInquiry } from '@/lib/inquiry-validation'
import { isPreviewMode } from '@/lib/preview-mode'

export async function submitInquiry(_previousState: InquiryState, formData: FormData): Promise<InquiryState> {
  const validation = validateInquiry(formData)

  if (!validation.ok) {
    return { status: 'error', message: validation.message, values: validation.values }
  }

  if (isPreviewMode()) {
    return {
      status: 'error',
      message: 'المعاينة المحلية لا تحفظ الاستفسارات. تواصل معنا عبر واتساب أو الهاتف.',
      values: validation.values,
    }
  }

  try {
    await createInquiry({ ...validation.values, source: 'contact-form' })
    return {
      status: 'success',
      message: 'تم إرسال استفسارك بنجاح. سيتواصل معك فريق الفردوس قريبًا.',
      values: { name: '', phone: '', subject: '', message: '' },
    }
  } catch {
    return {
      status: 'error',
      message: 'تعذر حفظ الاستفسار الآن. حاول مرة أخرى بعد قليل.',
      values: validation.values,
    }
  }
}
