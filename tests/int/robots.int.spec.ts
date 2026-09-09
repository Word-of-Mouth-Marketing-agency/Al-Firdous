import { describe, expect, it } from 'vitest'

import robots from '@/app/robots'

describe('robots policy', () => {
  it('keeps public indexing while excluding admin and API routes', () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules

    expect(rules).toMatchObject({ allow: '/', disallow: ['/admin', '/api'] })
    expect(result.sitemap?.toString()).toContain('/sitemap.xml')
  })
})
