import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import 'dotenv/config'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDirectory = path.join(projectRoot, '.local', 'postgres')
const host = '127.0.0.1'
const port = 55432
const databaseName = 'al_firdous_local'
const postgresBinDirectory = process.env.LOCAL_POSTGRES_BIN || 'A:/Programs/code/postgresql/bin'
const logFile = path.join(dataDirectory, 'server.log')

function executable(name) {
  return path.join(postgresBinDirectory, process.platform === 'win32' ? `${name}.exe` : name)
}

function readDatabaseConnection() {
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) return null

  const url = new URL(rawUrl)
  const database = decodeURIComponent(url.pathname.replace(/^\//, ''))

  if (url.hostname !== host || Number(url.port || 5432) !== port || database !== databaseName) {
    throw new Error(
      `DATABASE_URL must target ${host}:${port}/${databaseName} for local PostgreSQL commands.`,
    )
  }

  return {
    database,
    password: decodeURIComponent(url.password),
    user: decodeURIComponent(url.username),
  }
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    env: options.env || process.env,
  })
}

function databaseIdentity() {
  const connection = readDatabaseConnection()
  if (!connection || !fs.existsSync(executable('psql'))) return null

  const result = run(
    executable('psql'),
    [
      '-h',
      host,
      '-p',
      String(port),
      '-U',
      connection.user,
      '-d',
      connection.database,
      '-v',
      'ON_ERROR_STOP=1',
      '-Atc',
      "SELECT current_database() || E'\\n' || current_setting('port')",
    ],
    { env: { ...process.env, PGPASSWORD: connection.password } },
  )

  if (result.status !== 0) return null

  const [database, serverPort] = result.stdout.trim().split(/\r?\n/)
  return { database, serverPort: Number(serverPort) }
}

function projectClusterIsRunning() {
  const result = run(executable('pg_ctl'), ['-D', dataDirectory, 'status'])
  const output = `${result.stdout || ''}\n${result.stderr || ''}`
  return result.status === 0 && /server is running/i.test(output)
}

function isProjectDatabase(identity) {
  return Boolean(
    identity &&
      identity.database === databaseName &&
      identity.serverPort === port &&
      projectClusterIsRunning(),
  )
}

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })
    const finish = (open) => {
      socket.destroy()
      resolve(open)
    }

    socket.setTimeout(500)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })
}

export async function getLocalPostgresStatus() {
  if (!fs.existsSync(dataDirectory)) {
    return { state: 'stopped', reason: 'The .local/postgres data directory is missing.' }
  }

  const readiness = run(executable('pg_isready'), ['-h', host, '-p', String(port), '-d', databaseName])
  if (readiness.status === 0) {
    const identity = databaseIdentity()
    if (isProjectDatabase(identity)) {
      return { state: 'running', identity }
    }

    return {
      state: 'occupied',
      reason: `Port ${port} is accepting connections, but it is not the Al Firdous local cluster.`,
    }
  }

  if (await isPortOpen()) {
    return {
      state: 'occupied',
      reason: `Port ${port} is occupied by a service that is not the Al Firdous local cluster.`,
    }
  }

  return { state: 'stopped' }
}

function assertProjectFiles() {
  if (!fs.existsSync(dataDirectory)) {
    throw new Error(`Missing existing PostgreSQL data directory: ${dataDirectory}`)
  }

  for (const name of ['pg_ctl', 'pg_isready', 'psql']) {
    if (!fs.existsSync(executable(name))) {
      throw new Error(`Missing PostgreSQL executable: ${executable(name)}`)
    }
  }
}

export async function ensureLocalPostgres() {
  assertProjectFiles()
  const before = await getLocalPostgresStatus()

  if (before.state === 'running') {
    console.log(`Al Firdous local PostgreSQL is already RUNNING on ${host}:${port}.`)
    return before
  }

  if (before.state === 'occupied') {
    throw new Error(before.reason)
  }

  console.log(`Starting Al Firdous local PostgreSQL from ${path.relative(projectRoot, dataDirectory)}...`)
  const start = run(
    executable('pg_ctl'),
    ['-D', dataDirectory, '-o', `-p ${port}`, '-l', logFile, '-w', 'start'],
  )

  if (start.status !== 0) {
    const detail = `${start.stdout || ''}${start.stderr || ''}`.trim()
    throw new Error(`PostgreSQL failed to start.${detail ? `\n${detail}` : ''}`)
  }

  const after = await getLocalPostgresStatus()
  if (after.state !== 'running') {
    throw new Error(after.reason || 'PostgreSQL did not become the expected Al Firdous local cluster.')
  }

  console.log(`Al Firdous local PostgreSQL is RUNNING on ${host}:${port}.`)
  return after
}

export async function stopLocalPostgres() {
  assertProjectFiles()
  const before = await getLocalPostgresStatus()

  if (before.state === 'stopped') {
    console.log('Al Firdous local PostgreSQL is already STOPPED.')
    return before
  }

  if (before.state === 'occupied') {
    throw new Error(before.reason)
  }

  console.log('Stopping only the Al Firdous local PostgreSQL cluster...')
  const stop = run(executable('pg_ctl'), ['-D', dataDirectory, '-m', 'fast', '-w', 'stop'])
  if (stop.status !== 0) {
    const detail = `${stop.stdout || ''}${stop.stderr || ''}`.trim()
    throw new Error(`PostgreSQL failed to stop.${detail ? `\n${detail}` : ''}`)
  }

  const after = await getLocalPostgresStatus()
  if (after.state !== 'stopped') {
    throw new Error('PostgreSQL stop completed without releasing the project port.')
  }

  console.log('Al Firdous local PostgreSQL is STOPPED.')
  return after
}

export async function printLocalPostgresStatus() {
  const status = await getLocalPostgresStatus()
  console.log(`Al Firdous local PostgreSQL: ${status.state === 'running' ? 'RUNNING' : 'STOPPED'}`)
  console.log(`Data directory: ${path.relative(projectRoot, dataDirectory)}`)
  console.log(`Port: ${port}`)
  console.log(`Database: ${databaseName}`)
  if (status.reason) console.log(`Note: ${status.reason}`)
  return status
}

const command = process.argv[2]
const isMainModule = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
if (isMainModule && command) {
  try {
    if (command === 'start') await ensureLocalPostgres()
    else if (command === 'stop') await stopLocalPostgres()
    else if (command === 'status') await printLocalPostgresStatus()
    else throw new Error(`Unknown command "${command}". Use start, stop, or status.`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
