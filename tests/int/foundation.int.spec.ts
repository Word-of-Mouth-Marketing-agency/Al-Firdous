import { describe, expect, it } from 'vitest'

import { createPageMetadata, getSiteUrl } from '@/lib/seo'

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
})
