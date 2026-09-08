import { describe, expect, it } from 'vitest'

import { getCatalogData } from '@/lib/catalog-data'
import { fallbackCatalogManifest } from '@/lib/product-catalog'

describe('catalog fallback data', () => {
  it('keeps every unique supplied product asset in the committed manifest', () => {
    expect(fallbackCatalogManifest.totalSourceFiles).toBe(57)
    expect(fallbackCatalogManifest.uniqueVisualAssets).toBe(50)
    expect(fallbackCatalogManifest.products).toHaveLength(50)
    expect(new Set(fallbackCatalogManifest.products.map((product) => product.image)).size).toBe(50)
  })

  it('supports server-side Arabic search and brand filtering without a database', async () => {
    const original = process.env.HOMEPAGE_PREVIEW_CONTENT
    process.env.HOMEPAGE_PREVIEW_CONTENT = 'true'

    try {
      const result = await getCatalogData({ query: 'بطارية', brand: 'schwing', limit: 24 })
      expect(result.contentSource).toBe('fallback')
      expect(result.products.length).toBe(2)
      expect(result.products.every((product) => product.name.includes('بطارية'))).toBe(true)
      expect(result.products.every((product) => product.brand?.slug === 'schwing')).toBe(true)
    } finally {
      if (original === undefined) delete process.env.HOMEPAGE_PREVIEW_CONTENT
      else process.env.HOMEPAGE_PREVIEW_CONTENT = original
    }
  })
})
