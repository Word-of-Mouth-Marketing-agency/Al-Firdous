import { describe, expect, it } from 'vitest'

import { withTimeout } from '@/lib/async-utils'

describe('server async utilities', () => {
  it('preserves the original rejection before the timeout', async () => {
    await expect(withTimeout(Promise.reject(new Error('database unavailable')), 100)).rejects.toThrow('database unavailable')
  })

  it('returns null when an operation exceeds the timeout', async () => {
    const result = await withTimeout(new Promise<string>((resolve) => setTimeout(() => resolve('late'), 25)), 1)

    expect(result).toBeNull()
  })
})
