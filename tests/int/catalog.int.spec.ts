import { describe, expect, it } from 'vitest'

import { getCatalogData, getCatalogProductBySlug } from '@/lib/catalog-data'
import { fallbackCatalogManifest } from '@/lib/product-catalog'

describe('catalog fallback data', () => {
  it('keeps every supplied product file as a distinct committed catalog record', () => {
    expect(fallbackCatalogManifest.totalSourceFiles).toBe(57)
    expect(fallbackCatalogManifest.catalogRecords).toBe(57)
    expect(fallbackCatalogManifest.uniqueVisualAssets).toBe(50)
    expect(fallbackCatalogManifest.products).toHaveLength(57)
    expect(new Set(fallbackCatalogManifest.products.map((product) => product.image)).size).toBe(57)
    expect(new Set(fallbackCatalogManifest.products.map((product) => product.slug)).size).toBe(57)
    expect(new Set(fallbackCatalogManifest.products.map((product) => product.sourceFile)).size).toBe(57)
    expect(fallbackCatalogManifest.products.every((product) => product.categorySlug === 'concrete-pump-parts')).toBe(true)
    expect(fallbackCatalogManifest.products.every((product) => product.brandSlug === 'schwing')).toBe(true)
    expect(fallbackCatalogManifest.products.every((product) => product.sourceAliases.length === 1)).toBe(true)
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

  it('returns all 57 records for the pump category and Schwing brand without pagination gaps', async () => {
    const original = process.env.HOMEPAGE_PREVIEW_CONTENT
    process.env.HOMEPAGE_PREVIEW_CONTENT = 'true'

    try {
      const categoryResult = await getCatalogData({ category: 'concrete-pump-parts', limit: 24 })
      const brandResult = await getCatalogData({ brand: 'schwing', limit: 24 })
      const pages = await Promise.all([
        getCatalogData({ page: 1, limit: 24 }),
        getCatalogData({ page: 2, limit: 24 }),
        getCatalogData({ page: 3, limit: 24 }),
      ])
      const pagedProducts = pages.flatMap((page) => page.products)

      expect(categoryResult.totalDocs).toBe(57)
      expect(brandResult.totalDocs).toBe(57)
      expect(pagedProducts).toHaveLength(57)
      expect(new Set(pagedProducts.map((product) => product.slug)).size).toBe(57)
    } finally {
      if (original === undefined) delete process.env.HOMEPAGE_PREVIEW_CONTENT
      else process.env.HOMEPAGE_PREVIEW_CONTENT = original
    }
  })

  it('resolves every manifest slug through the fallback detail lookup', async () => {
    const original = process.env.HOMEPAGE_PREVIEW_CONTENT
    process.env.HOMEPAGE_PREVIEW_CONTENT = 'true'

    try {
      const products = await Promise.all(fallbackCatalogManifest.products.map((product) => getCatalogProductBySlug(product.slug)))
      expect(products).toHaveLength(57)
      expect(products.every((product) => product !== null)).toBe(true)
    } finally {
      if (original === undefined) delete process.env.HOMEPAGE_PREVIEW_CONTENT
      else process.env.HOMEPAGE_PREVIEW_CONTENT = original
    }
  })
})
