import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const paths = ['/', '/about', '/products', '/contact']

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
