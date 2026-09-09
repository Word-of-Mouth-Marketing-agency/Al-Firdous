import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getPayloadMock } = vi.hoisted(() => ({ getPayloadMock: vi.fn() }))

vi.mock('payload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('payload')>()),
  getPayload: getPayloadMock,
}))

import { getHomepageData, getSiteSettings } from '@/lib/homepage-data'

describe('frontend data loading modes', () => {
  beforeEach(() => {
    getPayloadMock.mockReset()
  })

  it('uses safe content and skips Payload in preview mode', async () => {
    const original = process.env.HOMEPAGE_PREVIEW_CONTENT
    process.env.HOMEPAGE_PREVIEW_CONTENT = 'true'

    try {
      const [settings, homepage] = await Promise.all([getSiteSettings(), getHomepageData()])

      expect(settings.whatsappUrl).toContain('wa.me/201031080031')
      expect(homepage.contentSource).toBe('fallback')
      expect(getPayloadMock).not.toHaveBeenCalled()
    } finally {
      if (original === undefined) delete process.env.HOMEPAGE_PREVIEW_CONTENT
      else process.env.HOMEPAGE_PREVIEW_CONTENT = original
    }
  })

  it('preserves a meaningful Payload error in normal mode', async () => {
    const original = process.env.HOMEPAGE_PREVIEW_CONTENT
    delete process.env.HOMEPAGE_PREVIEW_CONTENT
    getPayloadMock.mockRejectedValueOnce(new Error('password authentication failed'))

    try {
      await expect(getSiteSettings()).rejects.toThrow('Failed to load site settings: password authentication failed')
    } finally {
      if (original === undefined) delete process.env.HOMEPAGE_PREVIEW_CONTENT
      else process.env.HOMEPAGE_PREVIEW_CONTENT = original
    }
  })
})
