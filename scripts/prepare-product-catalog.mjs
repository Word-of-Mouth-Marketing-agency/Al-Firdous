import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.resolve(process.argv[2] || 'A:/Downloads/firdous-media')
const repoDir = path.resolve(process.cwd())
const outputDir = path.join(repoDir, 'public/images/products/catalog')
const dataDir = path.join(repoDir, 'src/data')
const docsDir = path.join(repoDir, 'docs')

const files = (await fs.readdir(sourceDir))
  .filter((file) => /\.(png|jpe?g)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, 'ar'))

await fs.rm(outputDir, { recursive: true, force: true })
await fs.mkdir(outputDir, { recursive: true })
await fs.mkdir(dataDir, { recursive: true })
await fs.mkdir(docsDir, { recursive: true })

const normalizeTitle = (file) =>
  path
    .parse(file)
    .name.replaceAll('_', '')
    .replaceAll('شيفينح', 'شيفينج')
    .replaceAll('ضح 125', 'ضخ 125')
    .replaceAll('ضخ 120', 'ضخ 120')
    .replace(/\s+/g, ' ')
    .trim()

const records = []
const groups = new Map()

for (const file of files) {
  const sourcePath = path.join(sourceDir, file)
  const contents = await fs.readFile(sourcePath)
  const metadata = await sharp(sourcePath).metadata()
  const hash = crypto.createHash('sha256').update(contents).digest('hex')
  const record = {
    file,
    hash,
    bytes: contents.length,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  }
  records.push(record)
  groups.set(hash, [...(groups.get(hash) || []), record])
}

const products = []

for (const [index, record] of records.entries()) {
  const slug = `schwing-pump-part-${String(index + 1).padStart(2, '0')}-${record.hash.slice(0, 8)}`
  const outputFilename = `${slug}.webp`
  const sourcePath = path.join(sourceDir, record.file)
  const outputPath = path.join(outputDir, outputFilename)

  await sharp(sourcePath)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .webp({ quality: 84, effort: 5 })
    .toFile(outputPath)

  const title = normalizeTitle(record.file)
  products.push({
    id: `catalog-${String(index + 1).padStart(2, '0')}`,
    slug,
    name: title,
    categorySlug: 'concrete-pump-parts',
    brandSlug: 'schwing',
    featured: index < 6,
    image: `/images/products/catalog/${outputFilename}`,
    sourceFile: record.file,
    sourceAliases: [record.file],
    sourceHash: record.hash,
    sourceWidth: record.width,
    sourceHeight: record.height,
  })
}

const manifest = {
  sourceDir: 'A:/Downloads/firdous-media',
  totalSourceFiles: records.length,
  catalogRecords: products.length,
  uniqueVisualAssets: groups.size,
  duplicateSourceGroups: [...groups.values()]
    .filter((group) => group.length > 1)
    .map((group) => group.map(({ file }) => file)),
  products,
}

await fs.writeFile(path.join(dataDir, 'product-catalog.json'), `${JSON.stringify(manifest, null, 2)}\n`)

const rows = products
  .map(
    (product, index) =>
      `| ${index + 1} | ${product.name} | \`${product.slug}\` | ${product.sourceAliases.map((file) => `\`${file}\``).join('<br>')} | \`${product.image}\` |`,
  )
  .join('\n')

const duplicateRows = manifest.duplicateSourceGroups
  .map((group) => `- ${group.map((file) => `\`${file}\``).join(' = ')}`)
  .join('\n')

await fs.writeFile(
  path.join(docsDir, 'product-media-inventory.md'),
  `# Product media inventory\n\n- Source folder: \`${manifest.sourceDir}\`\n- Source files processed: ${manifest.totalSourceFiles}\n- Catalog records published: ${manifest.catalogRecords}\n- Unique visual hashes (diagnostic only): ${manifest.uniqueVisualAssets}\n- Category mapping: all supplied media is mapped to \`concrete-pump-parts\` because the supplied inventory is concrete-pump spare-part media.\n- Brand mapping: all supplied records are mapped to the confirmed supported-brand record \`Schwing\`, per the production catalog brief.\n- Every source file is a distinct product record, including files with identical hashes. No source files are merged.\n\n## Exact duplicate source groups (retained as separate records)\n\n${duplicateRows}\n\n## Published catalog mapping\n\n| # | Product name | Stable slug | Source file | Published image |\n| ---: | --- | --- | --- | --- |\n${rows}\n`,
)

console.log(
  JSON.stringify(
    {
      totalSourceFiles: records.length,
      catalogRecords: products.length,
      uniqueVisualAssets: groups.size,
      outputDir,
      manifest: path.join(dataDir, 'product-catalog.json'),
    },
    null,
    2,
  ),
)
