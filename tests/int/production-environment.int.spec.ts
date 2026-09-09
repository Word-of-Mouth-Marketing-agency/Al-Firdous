import { describe, expect, it } from 'vitest'

import { validateProductionEnvironment } from '@/lib/production-environment'

const validProductionEnvironment = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgres://user:password@db.internal:5432/al_firdous',
  PAYLOAD_SECRET: 'a-long-production-secret-value',
  NEXT_PUBLIC_SITE_URL: 'https://alfirdous.example',
  PORT: '3000',
  HOSTNAME: '127.0.0.1',
  PAYLOAD_MEDIA_DIR: '/var/www/al-firdous/shared/media',
} as NodeJS.ProcessEnv

describe('production environment validation', () => {
  it('accepts the required production settings', () => {
    expect(() => validateProductionEnvironment(validProductionEnvironment)).not.toThrow()
  })

  it('rejects missing critical settings', () => {
    const environment = { ...validProductionEnvironment }
    delete environment.PAYLOAD_SECRET

    expect(() => validateProductionEnvironment(environment)).toThrow('PAYLOAD_SECRET')
  })

  it('rejects localhost and non-HTTPS canonical URLs', () => {
    expect(() =>
      validateProductionEnvironment({
        ...validProductionEnvironment,
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      }),
    ).toThrow()
    expect(() =>
      validateProductionEnvironment({
        ...validProductionEnvironment,
        NEXT_PUBLIC_SITE_URL: 'http://alfirdous.example',
      }),
    ).toThrow()
  })

  it('rejects malformed or non-PostgreSQL database URLs', () => {
    expect(() =>
      validateProductionEnvironment({
        ...validProductionEnvironment,
        DATABASE_URL: 'not-a-database-url',
      }),
    ).toThrow('DATABASE_URL')
    expect(() =>
      validateProductionEnvironment({
        ...validProductionEnvironment,
        DATABASE_URL: 'https://db.internal/al_firdous',
      }),
    ).toThrow('DATABASE_URL')
  })
})
