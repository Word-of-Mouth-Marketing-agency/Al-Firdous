import { beforeEach, describe, expect, it, vi } from 'vitest'

const { findMock, getPayloadMock } = vi.hoisted(() => ({
  findMock: vi.fn(),
  getPayloadMock: vi.fn(),
}))

vi.mock('payload', () => ({ getPayload: getPayloadMock }))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('@/lib/async-utils', () => ({ withTimeout: (promise: Promise<unknown>) => promise }))

import sitemap from '@/app/(frontend)/sitemap'

describe('live CMS sitemap', () => {
  beforeEach(() => {
    delete process.env.HOMEPAGE_PREVIEW_CONTENT
    findMock.mockReset()
    getPayloadMock.mockResolvedValue({ find: findMock })
  })

  it('includes active CMS product URLs once without query or admin paths', async () => {
    findMock.mockResolvedValue({
      docs: [
        { slug: 'jلبة-120', updatedAt: '2026-09-09T00:00:00.000Z' },
        { slug: 'jلبة-120', updatedAt: '2026-09-09T00:00:00.000Z' },
        { slug: 'حلقة-210', updatedAt: '2026-09-09T00:00:00.000Z' },
      ],
      totalPages: 1,
    })

    const entries = await sitemap()
    const productUrls = entries.filter((entry) => entry.url.includes('/products/'))

    expect(productUrls).toHaveLength(2)
    expect(new Set(productUrls.map((entry) => entry.url)).size).toBe(2)
    expect(productUrls.every((entry) => !entry.url.includes('?'))).toBe(true)
    expect(productUrls.some((entry) => entry.url.includes('/admin'))).toBe(false)
    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { active: { equals: true } } }),
    )
  })
})
