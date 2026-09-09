import { isVercelClientPreview } from '@/lib/preview-mode'

const PRODUCTION_BUILD_PHASE = 'phase-production-build'
const PLACEHOLDER_VALUE = /^(replace-with|change-me|your-|<)/i

type Environment = NodeJS.ProcessEnv

export function isProductionRuntime(environment: Environment = process.env) {
  return (
    environment.NODE_ENV === 'production' &&
    environment.NEXT_PHASE !== PRODUCTION_BUILD_PHASE &&
    !isVercelClientPreview(environment)
  )
}

function isMissing(value: string | undefined) {
  return !value?.trim() || PLACEHOLDER_VALUE.test(value.trim())
}

export function validateProductionEnvironment(environment: Environment = process.env) {
  if (!isProductionRuntime(environment)) return

  const required = [
    'DATABASE_URL',
    'PAYLOAD_SECRET',
    'NEXT_PUBLIC_SITE_URL',
    'NODE_ENV',
    'PORT',
    'HOSTNAME',
    'PAYLOAD_MEDIA_DIR',
  ]
  const missing = required.filter((name) => isMissing(environment[name]))

  if (missing.length) {
    throw new Error(`Production environment is missing required variables: ${missing.join(', ')}`)
  }

  try {
    const databaseUrl = new URL(environment.DATABASE_URL as string)
    if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol) || !databaseUrl.hostname) {
      throw new Error('invalid database URL')
    }
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL in production')
  }

  let siteUrl: URL
  try {
    siteUrl = new URL(environment.NEXT_PUBLIC_SITE_URL as string)
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid public URL in production')
  }

  if (
    siteUrl.protocol !== 'https:' ||
    ['localhost', '127.0.0.1', '::1'].includes(siteUrl.hostname.toLowerCase())
  ) {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS and a non-local hostname in production')
  }

  const port = Number(environment.PORT)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535 in production')
  }

  if (environment.HOMEPAGE_PREVIEW_CONTENT === 'true') {
    throw new Error('HOMEPAGE_PREVIEW_CONTENT must be disabled in production')
  }
}
