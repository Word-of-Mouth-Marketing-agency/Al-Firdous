import fs from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../src/payload.config'
import manifest from '../src/data/product-catalog.json'
import { confirmedCategoryDefaults, fallbackCatalogBrands } from '../src/lib/product-catalog'

const repoDir = process.cwd()
const publicDir = path.join(repoDir, 'public')

const categorySeeds = confirmedCategoryDefaults.map((category, index) => ({ ...category, sortOrder: index + 1 }))
const brandSeeds = fallbackCatalogBrands.map(({ name, slug }) => ({ name, slug }))

if (
  manifest.totalSourceFiles !== 57 ||
  manifest.catalogRecords !== 57 ||
  manifest.products.length !== 57 ||
  manifest.products.some(
    (product) => product.categorySlug !== 'concrete-pump-parts' || product.brandSlug !== 'schwing',
  )
) {
  throw new Error('The catalog manifest must contain exactly 57 Schwing concrete-pump-part records.')
}

const payload = await getPayload({ config })

async function findOne(collection: string, field: string, value: string) {
  const result = await payload.find({ collection: collection as never, limit: 1, where: { [field]: { equals: value } } })
  return result.docs[0] as { id: number } | undefined
}

const categories = new Map<string, number>()
for (const seed of categorySeeds) {
  const existing = await findOne('product-categories', 'slug', seed.slug)
  const document = existing
    ? await payload.update({ collection: 'product-categories', id: existing.id, data: { ...seed, active: true } })
    : await payload.create({ collection: 'product-categories', data: { ...seed, active: true } })
  categories.set(seed.slug, Number(document.id))
}

const brands = new Map<string, number>()
for (const seed of brandSeeds) {
  const existing = await findOne('brands', 'slug', seed.slug)
  const document = existing
    ? await payload.update({ collection: 'brands', id: existing.id, data: { ...seed, active: true } })
    : await payload.create({ collection: 'brands', data: { ...seed, active: true } })
  brands.set(seed.slug, Number(document.id))
}

for (const [index, product] of manifest.products.entries()) {
  const sourcePath = path.join(publicDir, product.image)
  const file = await fs.readFile(sourcePath)
  const metadata = await sharp(file).metadata()
  const existingMedia = await findOne('media', 'filename', path.basename(product.image))
  const media = existingMedia
    ? existingMedia
    : await payload.create({
        collection: 'media',
        data: { alt: product.name },
        file: {
          data: file,
          mimetype: 'image/webp',
          name: path.basename(product.image),
          size: file.byteLength,
        },
      })
  const existingProduct = await findOne('products', 'slug', product.slug)
  const categoryId = categories.get(product.categorySlug)
  if (!categoryId) throw new Error(`Missing category seed: ${product.categorySlug}`)
  const brandId = brands.get(product.brandSlug)
  if (!brandId) throw new Error(`Missing brand seed: ${product.brandSlug}`)
  const data = {
    name: product.name,
    slug: product.slug,
    shortDescription: 'قطعة من مجموعة قطع غيار مضخات الخرسانة المتاحة للاستفسار.',
    category: categoryId,
    brand: brandId,
    featured: product.featured,
    active: true,
    mainImage: media.id,
    availability: 'on-request' as const,
  }
  if (existingProduct) {
    await payload.update({ collection: 'products', id: existingProduct.id, data })
  } else {
    await payload.create({ collection: 'products', data, draft: false })
  }
  console.log(`${index + 1}/${manifest.products.length} ${product.name} (${metadata.width}x${metadata.height})`)
}

console.log(`Imported ${manifest.products.length} catalog products and ${categorySeeds.length} categories.`)

await payload.db.destroy?.()
process.exit(0)
