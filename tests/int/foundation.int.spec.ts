import { describe, expect, it } from 'vitest'

import { createPageMetadata, getSiteUrl } from '@/lib/seo'
import { toWhatsAppUrl, withWhatsAppMessage } from '@/lib/whatsapp'

describe('foundation SEO helpers', () => {
  it('uses a safe local URL fallback', () => {
    expect(getSiteUrl().toString()).toBe('http://localhost:3000/')
  })

  it('creates canonical Arabic page metadata', () => {
    const metadata = createPageMetadata({ title: 'المنتجات', path: '/products' })

    expect(metadata.title).toBe('المنتجات | الفردوس')
    expect(metadata.alternates?.canonical?.toString()).toBe('http://localhost:3000/products')
    expect(metadata.openGraph?.locale).toBe('ar_EG')
  })

  it('builds the canonical WhatsApp number and encoded message', () => {
    const url = toWhatsAppUrl('01031080031')

    expect(url).toBe('https://wa.me/201031080031')
    const message = 'مرحباً، أريد الاستفسار عن منتجات الفردوس.'
    const messageUrl = withWhatsAppMessage(url, message)

    expect(new URL(messageUrl || '').searchParams.get('text')).toBe(message)
  })
})
