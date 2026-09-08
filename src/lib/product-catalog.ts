import catalogManifest from '@/data/product-catalog.json'

export type FallbackCatalogProduct = {
  id: string
  name: string
  slug: string
  categorySlug: string
  brandSlug: string | null
  featured: boolean
  image: string
  sourceFile: string
  sourceAliases: string[]
  sourceHash: string
  sourceWidth: number | null
  sourceHeight: number | null
}

export const fallbackCatalogProducts = catalogManifest.products as FallbackCatalogProduct[]

export const confirmedCategoryDefaults = [
  { title: 'قطع غيار مضخات الخرسانة', slug: 'concrete-pump-parts' },
  { title: 'قطع غيار خلاطات الخرسانة', slug: 'concrete-mixer-parts' },
  { title: 'قطع غيار محطات الخرسانة', slug: 'concrete-plant-parts' },
  { title: 'قطع غيار عامة', slug: 'general-parts' },
] as const

export const confirmedPumpBrands = ['Zoomlion', 'Schwing', 'Putzmeister'] as const

export const fallbackCatalogCategories = [
  {
    id: `fallback-${confirmedCategoryDefaults[0].slug}`,
    ...confirmedCategoryDefaults[0],
    description: 'مجموعة من قطع غيار مضخات الخرسانة من الوسائط المتاحة لدينا.',
  },
  {
    id: `fallback-${confirmedCategoryDefaults[1].slug}`,
    ...confirmedCategoryDefaults[1],
    description: null,
  },
  {
    id: `fallback-${confirmedCategoryDefaults[2].slug}`,
    ...confirmedCategoryDefaults[2],
    description: null,
  },
  {
    id: `fallback-${confirmedCategoryDefaults[3].slug}`,
    ...confirmedCategoryDefaults[3],
    description: null,
  },
] as const

export const fallbackCatalogBrands = [
  { id: 'fallback-zoomlion', name: confirmedPumpBrands[0], slug: 'zoomlion' },
  { id: 'fallback-schwing', name: confirmedPumpBrands[1], slug: 'schwing' },
  { id: 'fallback-putzmeister', name: confirmedPumpBrands[2], slug: 'putzmeister' },
] as const

export const fallbackCatalogManifest = catalogManifest
