import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const inputPath = process.argv[2] || 'A:/Downloads/favico.png'
const root = process.cwd()
const appDir = path.join(root, 'src', 'app')
const publicDir = path.join(root, 'public')

await fs.mkdir(appDir, { recursive: true })

const sizes = [16, 32, 48, 180, 192, 512]
const blue = { r: 49, g: 118, b: 171, alpha: 1 }

async function render(size) {
  const mark = await sharp(inputPath)
    .resize({ width: Math.round(size * 0.84), height: Math.round(size * 0.84), fit: 'contain' })
    .png()
    .toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background: blue },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer()
}

const rendered = new Map()
for (const size of sizes) rendered.set(size, await render(size))

await fs.writeFile(path.join(appDir, 'icon.png'), rendered.get(32))
await fs.writeFile(path.join(appDir, 'apple-icon.png'), rendered.get(180))
await fs.writeFile(path.join(publicDir, 'favicon-16x16.png'), rendered.get(16))
await fs.writeFile(path.join(publicDir, 'favicon-32x32.png'), rendered.get(32))
await fs.writeFile(path.join(publicDir, 'android-chrome-192x192.png'), rendered.get(192))
await fs.writeFile(path.join(publicDir, 'android-chrome-512x512.png'), rendered.get(512))

const icoSizes = [16, 32, 48]
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(icoSizes.length, 4)
const entries = []
let offset = header.length + icoSizes.length * 16
for (const size of icoSizes) {
  const png = rendered.get(size)
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size === 256 ? 0 : size, 0)
  entry.writeUInt8(size === 256 ? 0 : size, 1)
  entry.writeUInt8(0, 2)
  entry.writeUInt8(0, 3)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png.byteLength, 8)
  entry.writeUInt32LE(offset, 12)
  entries.push(entry)
  offset += png.byteLength
}

await fs.writeFile(
  path.join(appDir, 'favicon.ico'),
  Buffer.concat([header, ...entries, ...icoSizes.map((size) => rendered.get(size))]),
)
console.log(`Generated favicon assets from ${inputPath}`)
