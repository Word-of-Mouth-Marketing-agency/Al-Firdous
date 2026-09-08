import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/seo'
import { fallbackCatalogProducts } from '@/lib/product-catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const paths = ['/', '/about', '/products', '/contact']

  const staticEntries = paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  const productEntries = fallbackCatalogProducts.map((product) => ({
    url: new URL(`/products/${product.slug}`, siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...productEntries]
}
