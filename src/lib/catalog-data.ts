import { getPayload } from 'payload'
import type { Where } from 'payload'

import config from '@payload-config'
import { withTimeout } from '@/lib/async-utils'
import type { Brand, Media, Product, ProductCategory } from '@/payload-types'
import {
  fallbackCatalogBrands,
  fallbackCatalogCategories,
  fallbackCatalogProducts,
} from '@/lib/product-catalog'
import { isPreviewMode } from '@/lib/preview-mode'
import { createServerDataError } from '@/lib/server-errors'

export type CatalogCategory = {
  id: number | string
  title: string
  slug: string
  description: string | null
}

export type CatalogBrand = {
  id: number | string
  name: string
  slug: string
}

export type CatalogProduct = {
  id: number | string
  name: string
  slug: string
  partNumber: string | null
  shortDescription: string | null
  category: CatalogCategory
  brand: CatalogBrand | null
  image: Media | null
  fallbackImageSrc: string | null
  gallery: Media[]
  featured: boolean
  availability: 'available' | 'on-request' | 'discontinued' | null
  sourceAliases: string[]
}

export type CatalogQuery = {
  query?: string
  category?: string
  brand?: string
  page?: number
  limit?: number
}

export type CatalogResult = {
  products: CatalogProduct[]
  categories: CatalogCategory[]
  brands: CatalogBrand[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  query: string
  category: string
  brand: string
  contentSource: 'cms' | 'fallback'
}

const defaultCategories: CatalogCategory[] = fallbackCatalogCategories.map((category) => ({
  id: category.id,
  title: category.title,
  slug: category.slug,
  description: category.description,
}))

const defaultBrands: CatalogBrand[] = fallbackCatalogBrands.map((brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
}))

function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null && 'id' in value
}

function isCategory(value: number | ProductCategory): value is ProductCategory {
  return typeof value === 'object' && value !== null && 'slug' in value
}

function isBrand(value: number | null | Brand | undefined): value is Brand {
  return typeof value === 'object' && value !== null && 'slug' in value
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('ar-EG')
}

function mapCategory(category: ProductCategory | CatalogCategory): CatalogCategory {
  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description ?? null,
  }
}

function mapBrand(brand: Brand | CatalogBrand | null | undefined): CatalogBrand | null {
  if (!brand) return null
  return { id: brand.id, name: brand.name, slug: brand.slug }
}

function mapProduct(product: Product): CatalogProduct | null {
  if (!isCategory(product.category)) return null

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    partNumber: product.partNumber ?? null,
    shortDescription: product.shortDescription ?? null,
    category: mapCategory(product.category),
    brand: mapBrand(isBrand(product.brand) ? product.brand : null),
    image: isMedia(product.mainImage) ? product.mainImage : null,
    fallbackImageSrc: null,
    gallery: Array.isArray(product.gallery)
      ? product.gallery.filter((item): item is Media => isMedia(item))
      : [],
    featured: product.featured === true,
    availability: product.availability ?? null,
    sourceAliases: [],
  }
}

function fallbackProductToCatalog(product: (typeof fallbackCatalogProducts)[number]): CatalogProduct {
  const category = defaultCategories.find((item) => item.slug === product.categorySlug) ?? defaultCategories[0]
  const brand = defaultBrands.find((item) => item.slug === product.brandSlug) ?? null

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    partNumber: null,
    shortDescription: 'قطعة من مجموعة قطع غيار مضخات الخرسانة المتاحة للاستفسار.',
    category,
    brand,
    image: null,
    fallbackImageSrc: product.image,
    gallery: [],
    featured: product.featured,
    availability: 'on-request',
    sourceAliases: product.sourceAliases,
  }
}

function buildFallbackCatalog(query: CatalogQuery): CatalogResult {
  const limit = Math.min(Math.max(query.limit ?? 24, 1), 48)
  const page = Math.max(query.page ?? 1, 1)
  const normalizedQuery = normalize(query.query ?? '')
  const category = query.category?.trim() ?? ''
  const brand = query.brand?.trim() ?? ''
  const products = fallbackCatalogProducts
    .map(fallbackProductToCatalog)
    .filter((product) => {
      const matchesQuery = !normalizedQuery || normalize(`${product.name} ${product.shortDescription ?? ''}`).includes(normalizedQuery)
      const matchesCategory = !category || product.category.slug === category
      const matchesBrand = !brand || product.brand?.slug === brand
      return matchesQuery && matchesCategory && matchesBrand
    })
  const totalPages = Math.max(Math.ceil(products.length / limit), 1)
  const safePage = Math.min(page, totalPages)

  return {
    products: products.slice((safePage - 1) * limit, safePage * limit),
    categories: defaultCategories,
    brands: defaultBrands,
    totalDocs: products.length,
    totalPages,
    page: safePage,
    limit,
    query: query.query?.trim() ?? '',
    category,
    brand,
    contentSource: 'fallback',
  }
}

export async function getCatalogData(query: CatalogQuery = {}): Promise<CatalogResult> {
  if (isPreviewMode()) return buildFallbackCatalog(query)

  try {
    const payload = await withTimeout(getPayload({ config }), 2500)
    if (!payload) throw new Error('Payload connection timed out')

    const limit = Math.min(Math.max(query.limit ?? 24, 1), 48)
    const page = Math.max(query.page ?? 1, 1)
    const where: Where[] = [{ active: { equals: true } }]

    if (query.category) where.push({ 'category.slug': { equals: query.category } })
    if (query.brand) where.push({ 'brand.slug': { equals: query.brand } })
    if (query.query?.trim()) {
      const search = query.query.trim()
      where.push({
        or: [{ name: { contains: search } }, { shortDescription: { contains: search } }],
      })
    }

    const result = await withTimeout(
      Promise.all([
        payload.find({ collection: 'products', depth: 1, limit, page, sort: 'name', where: { and: where } }),
        payload.find({ collection: 'product-categories', depth: 0, limit: 20, sort: 'sortOrder', where: { active: { equals: true } } }),
        payload.find({ collection: 'brands', depth: 0, limit: 20, sort: 'name', where: { active: { equals: true } } }),
      ]),
      3500,
    )

    if (!result) throw new Error('Catalog query timed out')
    const [productsResult, categoriesResult, brandsResult] = result
    const products = (productsResult.docs as Product[]).map(mapProduct).filter((product): product is CatalogProduct => Boolean(product))
    if (!products.length && !query.query && !query.category && !query.brand) return buildFallbackCatalog(query)

    return {
      products,
      categories: (categoriesResult.docs as ProductCategory[]).map(mapCategory).length
        ? (categoriesResult.docs as ProductCategory[]).map(mapCategory)
        : defaultCategories,
      brands: (brandsResult.docs as Brand[]).map(mapBrand).filter((brand): brand is CatalogBrand => Boolean(brand)).length
        ? (brandsResult.docs as Brand[]).map(mapBrand).filter((brand): brand is CatalogBrand => Boolean(brand))
        : defaultBrands,
      totalDocs: productsResult.totalDocs,
      totalPages: Math.max(productsResult.totalPages, 1),
      page: productsResult.page ?? page,
      limit,
      query: query.query?.trim() ?? '',
      category: query.category?.trim() ?? '',
      brand: query.brand?.trim() ?? '',
      contentSource: 'cms',
    }
  } catch (error) {
    throw createServerDataError('Failed to load catalog data', error)
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const fallback = fallbackCatalogProducts.find((product) => product.slug === slug)
  if (isPreviewMode()) return fallback ? fallbackProductToCatalog(fallback) : null

  try {
    const payload = await withTimeout(getPayload({ config }), 2500)
    if (payload) {
      const result = await withTimeout(
        payload.find({ collection: 'products', depth: 1, limit: 1, where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] } }),
        3000,
      )
      const product = result?.docs ? mapProduct(result.docs[0] as Product) : null
      if (product) return product
    }
  } catch (error) {
    throw createServerDataError(`Failed to load product "${slug}"`, error)
  }

  return fallback ? fallbackProductToCatalog(fallback) : null
}
