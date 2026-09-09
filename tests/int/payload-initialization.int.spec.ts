import type { DatabaseAdapterObj } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { describe, expect, it } from 'vitest'

import { guardPostgresInitialization } from '@/lib/payload-initialization'

describe('Payload database initialization guard', () => {
  it('consumes Payload’s reasonless initialization rejection without swallowing getPayload errors', async () => {
    const unhandledReasons: unknown[] = []
    const onUnhandledRejection = (reason: unknown) => unhandledReasons.push(reason)
    process.on('unhandledRejection', onUnhandledRejection)

    try {
      const initializing = Promise.reject(undefined)
      const database = {
        defaultIDType: 'number' as const,
        init: () => ({ initializing }),
      } as unknown as DatabaseAdapterObj<PostgresAdapter>

      const adapter = guardPostgresInitialization(database).init({ payload: {} as never })

      await new Promise((resolve) => setImmediate(resolve))

      expect(adapter.initializing).toBe(initializing)
      expect(unhandledReasons).toEqual([])
    } finally {
      process.off('unhandledRejection', onUnhandledRejection)
    }
  })
})
