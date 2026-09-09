import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { confirmedCategoryDefaults, confirmedPumpBrands } from '../src/lib/product-catalog'
import type { Brand, Media, Product, ProductCategory, SiteSetting } from '../src/payload-types'

const payload = await getPayload({ config })

const [categoriesResult, brandsResult, productsResult, settings, users, media, inquiries] = await Promise.all([
  payload.find({ collection: 'product-categories', depth: 0, limit: 100, sort: 'sortOrder' }),
  payload.find({ collection: 'brands', depth: 0, limit: 100, sort: 'name' }),
  payload.find({ collection: 'products', depth: 1, limit: 1000, sort: 'slug' }),
  payload.findGlobal({ slug: 'site-settings', depth: 1 }),
  payload.count({ collection: 'users' }),
  payload.count({ collection: 'media' }),
  payload.count({ collection: 'inquiries' }),
])

const categories = categoriesResult.docs as ProductCategory[]
const brands = brandsResult.docs as Brand[]
const products = productsResult.docs as Product[]
const categoryById = new Map(categories.map((category) => [String(category.id), category]))
const brandById = new Map(brands.map((brand) => [String(brand.id), brand]))

function relationshipName(value: number | { id: number; title?: string; name?: string } | null | undefined) {
  if (!value || typeof value !== 'object') return null
  return value.title || value.name || null
}

const productChecks = products.map((product) => ({
  slug: product.slug,
  hasImage: Boolean(product.mainImage && typeof product.mainImage === 'object' && (product.mainImage as Media).url),
  category: relationshipName(product.category) || categoryById.get(String(product.category))?.title || null,
  brand: relationshipName(product.brand) || (typeof product.brand === 'number' ? brandById.get(String(product.brand))?.name : null) || null,
}))

const categorySlugs = categories.map((category) => category.slug)
const brandNames = brands.map((brand) => brand.name)
const featuredCount = products.filter((product) => product.featured === true).length
const uniqueSlugs = new Set(products.map((product) => product.slug)).size
const allPumpParts = productChecks.every((product) => product.category === 'قطع غيار مضخات الخرسانة')
const allSchwing = productChecks.every((product) => product.brand === 'Schwing')
const allHaveImages = productChecks.every((product) => product.hasImage)

const report = {
  counts: {
    users: users.totalDocs,
    media: media.totalDocs,
    categories: categories.length,
    brands: brands.length,
    products: products.length,
    inquiries: inquiries.totalDocs,
  },
  categories: categorySlugs,
  brands: brandNames,
  products: {
    uniqueSlugs,
    featuredCount,
    allHaveImages,
    allPumpParts,
    allSchwing,
  },
  settings: {
    companyName: (settings as SiteSetting).companyName,
    contacts: settings.contacts?.length ?? 0,
    primaryWhatsApp: settings.primaryWhatsApp,
    logoConfigured: Boolean(settings.logo),
    socialLinks: Object.keys(settings.socialLinks || {}),
  },
  expected: {
    categories: confirmedCategoryDefaults.map((category) => category.slug),
    brands: [...confirmedPumpBrands],
    productCount: 57,
  },
}

console.log(JSON.stringify(report, null, 2))

if (
  products.length !== 57 ||
  uniqueSlugs !== 57 ||
  categories.length !== 4 ||
  brands.length !== 3 ||
  JSON.stringify(categorySlugs) !== JSON.stringify(confirmedCategoryDefaults.map((category) => category.slug)) ||
  !confirmedPumpBrands.every((brand) => brandNames.includes(brand)) ||
  !allHaveImages ||
  !allPumpParts ||
  !allSchwing
) {
  throw new Error('Local CMS verification failed.')
}

await payload.db.destroy?.()
process.exit(0)
