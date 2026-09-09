import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureLocalPostgres } from './local-postgres.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

try {
  await ensureLocalPostgres()

  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const forwardedArgs = process.argv.slice(2)
  const devArgs = ['run', 'dev']
  if (forwardedArgs.length > 0) devArgs.push('--', ...forwardedArgs)

  const child = spawn(npmCommand, devArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    windowsHide: false,
  })

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      if (!child.killed) child.kill(signal)
    })
  }

  child.on('error', (error) => {
    console.error(`Could not start npm run dev: ${error.message}`)
    process.exitCode = 1
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      console.error(`npm run dev stopped by ${signal}.`)
      process.exitCode = 1
    } else {
      process.exitCode = code ?? 1
    }
  })
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
