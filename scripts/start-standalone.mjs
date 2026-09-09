import { access } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const standaloneServer = path.join(root, '.next', 'standalone', 'server.js')

dotenv.config({ path: path.join(root, '.env') })
process.env.NODE_ENV = 'production'

const required = [
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SITE_URL',
  'PORT',
  'HOSTNAME',
  'PAYLOAD_MEDIA_DIR',
]
const missing = required.filter((name) => !process.env[name]?.trim())
if (missing.length) {
  throw new Error(
    `Cannot start production server; missing environment variables: ${missing.join(', ')}`,
  )
}

const placeholder = /^(replace-with|change-me|your-|<)/i
const placeholderVariables = [
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SITE_URL',
  'PAYLOAD_MEDIA_DIR',
].filter((name) => placeholder.test(process.env[name].trim()))
if (placeholderVariables.length) {
  throw new Error(
    `Cannot start production server; placeholder values remain in: ${placeholderVariables.join(', ')}`,
  )
}

try {
  const databaseUrl = new URL(process.env.DATABASE_URL)
  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol) || !databaseUrl.hostname)
    throw new Error('invalid database URL')
} catch {
  throw new Error('DATABASE_URL must be a valid PostgreSQL URL in production')
}

let siteUrl
try {
  siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL)
} catch {
  throw new Error('NEXT_PUBLIC_SITE_URL must be a valid public URL in production')
}
if (
  siteUrl.protocol !== 'https:' ||
  ['localhost', '127.0.0.1', '::1'].includes(siteUrl.hostname.toLowerCase())
) {
  throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS and a non-local hostname in production')
}

const port = Number(process.env.PORT)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535 in production')
}

if (process.env.HOMEPAGE_PREVIEW_CONTENT === 'true') {
  throw new Error('Cannot start production server with HOMEPAGE_PREVIEW_CONTENT=true')
}

for (const requiredPath of [
  standaloneServer,
  path.join(root, '.next', 'standalone', 'public'),
  path.join(root, '.next', 'standalone', '.next', 'static'),
]) {
  try {
    await access(requiredPath)
  } catch {
    throw new Error('Standalone build assets are missing; run npm run build:standalone first')
  }
}

const child = spawn(process.execPath, [standaloneServer], {
  cwd: path.join(root, '.next', 'standalone'),
  env: process.env,
  stdio: 'inherit',
})

const forwardSignal = (signal) => child.kill(signal)
process.once('SIGINT', () => forwardSignal('SIGINT'))
process.once('SIGTERM', () => forwardSignal('SIGTERM'))

child.once('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
