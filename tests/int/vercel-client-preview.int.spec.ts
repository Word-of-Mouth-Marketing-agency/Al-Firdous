import { afterEach, describe, expect, it } from 'vitest'

import { getHomepageData } from '@/lib/homepage-data'
import { getSiteUrl } from '@/lib/seo'

describe('Vercel client preview mode', () => {
  const environment = process.env as Record<string, string | undefined>
  const original = {
    clientPreview: process.env.VERCEL_CLIENT_PREVIEW,
    vercelUrl: process.env.VERCEL_URL,
    nodeEnv: process.env.NODE_ENV,
  }

  afterEach(() => {
    if (original.clientPreview === undefined) delete environment.VERCEL_CLIENT_PREVIEW
    else environment.VERCEL_CLIENT_PREVIEW = original.clientPreview
    if (original.vercelUrl === undefined) delete environment.VERCEL_URL
    else environment.VERCEL_URL = original.vercelUrl
    if (original.nodeEnv === undefined) delete environment.NODE_ENV
    else environment.NODE_ENV = original.nodeEnv
  })

  it('uses the Vercel deployment host for production-style metadata', () => {
    expect(
      getSiteUrl({
        NODE_ENV: 'production',
        VERCEL_CLIENT_PREVIEW: 'true',
        VERCEL_URL: 'al-firdous-test.vercel.app',
      }),
    ).toEqual(new URL('https://al-firdous-test.vercel.app'))
  })

  it('renders the committed homepage catalog without a database', async () => {
    environment.NODE_ENV = 'production'
    environment.VERCEL_CLIENT_PREVIEW = 'true'
    environment.VERCEL_URL = 'al-firdous-test.vercel.app'

    const data = await getHomepageData()

    expect(data.contentSource).toBe('fallback')
    expect(data.categories).toHaveLength(4)
    expect(data.featuredProducts).toHaveLength(6)
    expect(data.siteSettings.primaryPhone).toBe('01031080031')
  })
})
