import type { DatabaseAdapterObj } from 'payload'
import type { PostgresAdapter } from '@payloadcms/db-postgres'

export function guardPostgresInitialization(
  database: DatabaseAdapterObj<PostgresAdapter>,
): DatabaseAdapterObj<PostgresAdapter> {
  return {
    ...database,
    init(args) {
      const adapter = database.init(args)

      // Payload 3.88 rejects this internal bookkeeping promise without a reason when
      // PostgreSQL connection setup fails. The actual getPayload promise still rejects
      // with the database Error, so only this duplicate unhandled rejection is consumed.
      void adapter.initializing.catch(() => undefined)

      return adapter
    },
  }
}
