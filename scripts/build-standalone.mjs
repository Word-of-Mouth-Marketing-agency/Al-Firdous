import { cp, access } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const buildCommand = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : npmCommand
const buildArgs =
  process.platform === 'win32' ? ['/d', '/s', '/c', `${npmCommand} run build`] : ['run', 'build']

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
    `Cannot create a production standalone build; missing environment variables: ${missing.join(', ')}`,
  )
}

try {
  const databaseUrl = new URL(process.env.DATABASE_URL)
  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol) || !databaseUrl.hostname)
    throw new Error('invalid database URL')
} catch {
  throw new Error('DATABASE_URL must be a valid PostgreSQL URL for a standalone build')
}

let siteUrl
try {
  siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL)
} catch {
  throw new Error('NEXT_PUBLIC_SITE_URL must be a valid public URL for a standalone build')
}
if (
  siteUrl.protocol !== 'https:' ||
  ['localhost', '127.0.0.1', '::1'].includes(siteUrl.hostname.toLowerCase())
) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must use HTTPS and a non-local hostname for a standalone build',
  )
}
if (process.env.HOMEPAGE_PREVIEW_CONTENT === 'true') {
  throw new Error('HOMEPAGE_PREVIEW_CONTENT must be disabled for a standalone build')
}

const build = spawnSync(buildCommand, buildArgs, {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
})

if (build.error) {
  console.error(build.error)
  process.exit(1)
}

if (build.status !== 0) process.exit(build.status ?? 1)

const standaloneDir = path.join(root, '.next', 'standalone')
await cp(path.join(root, '.next', 'static'), path.join(standaloneDir, '.next', 'static'), {
  recursive: true,
  force: true,
})
await cp(path.join(root, 'public'), path.join(standaloneDir, 'public'), {
  recursive: true,
  force: true,
})

const requiredPaths = [
  path.join(standaloneDir, 'server.js'),
  path.join(standaloneDir, '.next', 'static'),
  path.join(standaloneDir, 'public'),
  path.join(standaloneDir, 'public', 'images', 'home', 'hero-industrial.webp'),
]

for (const requiredPath of requiredPaths) {
  try {
    await access(requiredPath)
  } catch {
    throw new Error(
      `Standalone packaging is incomplete; missing ${path.relative(root, requiredPath)}`,
    )
  }
}

console.log('Standalone package verified: .next/standalone/server.js, public/, and .next/static/')
