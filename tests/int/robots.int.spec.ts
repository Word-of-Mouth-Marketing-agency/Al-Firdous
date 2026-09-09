import { afterEach, describe, expect, it } from 'vitest'

import robots from '@/app/robots'

describe('robots policy', () => {
  const originalPreview = process.env.VERCEL_CLIENT_PREVIEW
  const originalVercelUrl = process.env.VERCEL_URL

  afterEach(() => {
    if (originalPreview === undefined) delete process.env.VERCEL_CLIENT_PREVIEW
    else process.env.VERCEL_CLIENT_PREVIEW = originalPreview
    if (originalVercelUrl === undefined) delete process.env.VERCEL_URL
    else process.env.VERCEL_URL = originalVercelUrl
  })

  it('keeps public indexing while excluding admin and API routes', () => {
    delete process.env.VERCEL_CLIENT_PREVIEW
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules

    expect(rules).toMatchObject({ allow: '/', disallow: ['/admin', '/api'] })
    expect(result.sitemap?.toString()).toContain('/sitemap.xml')
  })

  it('blocks crawling for the Vercel client preview', () => {
    process.env.VERCEL_CLIENT_PREVIEW = 'true'
    process.env.VERCEL_URL = 'al-firdous-test.vercel.app'

    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules

    expect(rules).toEqual({ userAgent: '*', disallow: '/' })
    expect(result.sitemap).toBeUndefined()
  })
})
