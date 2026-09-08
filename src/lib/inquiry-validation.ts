export type InquiryValues = {
  name: string
  phone: string
  subject: string
  message: string
  website: string
}

export type InquiryValidationResult =
  | { ok: true; values: Omit<InquiryValues, 'website'> }
  | { ok: false; message: string; values: Omit<InquiryValues, 'website'> }

function clean(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeEgyptianPhone(value: string) {
  const compact = value.replace(/[\s().-]/g, '')
  if (compact.startsWith('+20')) return `0${compact.slice(3)}`
  if (compact.startsWith('20') && compact.length === 12) return `0${compact.slice(2)}`
  return compact
}

export function validateInquiry(formData: FormData): InquiryValidationResult {
  const values = {
    name: clean(formData.get('name')),
    phone: clean(formData.get('phone')),
    subject: clean(formData.get('subject')),
    message: clean(formData.get('message')),
  }
  const website = clean(formData.get('website'))

  if (website) return { ok: false, message: 'تعذر إرسال الاستفسار. حاول مرة أخرى.', values }
  if (values.name.length < 2 || values.name.length > 120) {
    return { ok: false, message: 'يرجى إدخال الاسم بشكل صحيح.', values }
  }
  if (!/^01[0125]\d{8}$/.test(normalizeEgyptianPhone(values.phone))) {
    return { ok: false, message: 'يرجى إدخال رقم هاتف مصري صحيح.', values }
  }
  if (values.subject.length > 160) {
    return { ok: false, message: 'موضوع الاستفسار طويل جدًا.', values }
  }
  if (values.message.length < 5 || values.message.length > 2000) {
    return { ok: false, message: 'يرجى كتابة تفاصيل الاستفسار.', values }
  }

  return { ok: true, values: { ...values, phone: normalizeEgyptianPhone(values.phone) } }
}
