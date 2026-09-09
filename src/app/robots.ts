import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/seo'
import { isVercelClientPreview } from '@/lib/preview-mode'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  if (isVercelClientPreview()) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      host: siteUrl.toString(),
    }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl.toString(),
  }
}
