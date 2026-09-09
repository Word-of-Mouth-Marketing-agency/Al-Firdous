import type { MetadataRoute } from 'next'

import { getPayload } from 'payload'

import config from '@payload-config'
import { withTimeout } from '@/lib/async-utils'
import { getSiteUrl } from '@/lib/seo'
import { fallbackCatalogProducts } from '@/lib/product-catalog'
import { isPreviewMode } from '@/lib/preview-mode'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const paths = ['/', '/about', '/products', '/contact']

  const staticEntries = paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  const products = isPreviewMode()
    ? fallbackCatalogProducts.map((product) => ({ slug: product.slug, updatedAt: undefined }))
    : await loadActiveProducts()

  const productEntries = products.map((product) => ({
    url: new URL(`/products/${product.slug}`, siteUrl).toString(),
    lastModified: product.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...productEntries]
}

async function loadActiveProducts() {
  const payload = await withTimeout(getPayload({ config }), 2500)
  if (!payload) throw new Error('Payload connection timed out while building the sitemap')

  const products: { slug: string; updatedAt: string }[] = []
  let page = 1

  while (true) {
    const result = await withTimeout(
      payload.find({
        collection: 'products',
        depth: 0,
        limit: 100,
        page,
        sort: 'slug',
        where: { active: { equals: true } },
      }),
      5000,
    )

    if (!result) throw new Error('Sitemap product query timed out')
    for (const product of result.docs) {
      if (!products.some((item) => item.slug === product.slug)) {
        products.push({ slug: product.slug, updatedAt: product.updatedAt })
      }
    }
    if (page >= result.totalPages || result.docs.length === 0) break
    page += 1
  }

  return products
}
