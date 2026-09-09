'use client'

import { useActionState } from 'react'

import { submitInquiry } from '@/app/(frontend)/contact/actions'
import { initialInquiryState } from '@/lib/inquiry-form-state'

export function InquiryForm({
  clientPreview = false,
  whatsappUrl,
}: {
  clientPreview?: boolean
  whatsappUrl?: string | null
}) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialInquiryState)

  return (
    <div className="contact-form-card">
      <div className="contact-form-card__heading">
        <p className="page-kicker">استفسار مباشر</p>
        <h2>أرسل تفاصيل طلبك</h2>
        <p>اكتب بياناتك وسنساعدك في الوصول إلى القطعة المناسبة.</p>
      </div>

      {clientPreview ? (
        <div className="contact-form__preview-note" role="note">
          <p>هذه نسخة معاينة للموقع. للتواصل يرجى استخدام واتساب.</p>
          {whatsappUrl ? <a href={whatsappUrl}>تواصل عبر واتساب</a> : null}
        </div>
      ) : null}

      {state.status === 'success' ? <p className="contact-form__success" role="status" aria-live="polite">{state.message}</p> : null}
      {state.status === 'error' ? <p className="contact-form__error" role="alert">{state.message}</p> : null}

      <form action={formAction} className="contact-form">
        <div className="contact-form__row">
          <label className="contact-form__field">
            <span>الاسم <strong aria-hidden="true">*</strong></span>
            <input name="name" required maxLength={120} defaultValue={state.values.name} autoComplete="name" />
          </label>
          <label className="contact-form__field">
            <span>رقم الهاتف <strong aria-hidden="true">*</strong></span>
            <input name="phone" required maxLength={30} defaultValue={state.values.phone} autoComplete="tel" inputMode="tel" dir="ltr" />
            <small>مثال: 01031080031</small>
          </label>
        </div>
        <label className="contact-form__field">
          <span>موضوع الاستفسار / المنتج</span>
          <input name="subject" maxLength={160} defaultValue={state.values.subject} />
        </label>
        <label className="contact-form__field">
          <span>رسالتك <strong aria-hidden="true">*</strong></span>
          <textarea name="message" required minLength={5} maxLength={2000} defaultValue={state.values.message} rows={5} />
        </label>
        <label className="contact-form__honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <div className="contact-form__actions">
          <button type="submit" className="button button--primary" disabled={isPending || clientPreview}>
            {clientPreview ? 'متاح عبر واتساب فقط' : isPending ? 'جارٍ الإرسال...' : 'إرسال الاستفسار'}
          </button>
          <p>{clientPreview ? 'هذه النسخة لا تحفظ الاستفسارات في قاعدة البيانات.' : 'لن يتم عرض بياناتك على الموقع.'}</p>
        </div>
      </form>
    </div>
  )
}
