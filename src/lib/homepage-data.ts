import { getPayload } from 'payload'

import config from '@payload-config'
import { withTimeout } from '@/lib/async-utils'
import type { Brand, Media, Product, ProductCategory, SiteSetting } from '@/payload-types'
import { PRIMARY_WHATSAPP_PHONE, toWhatsAppUrl } from '@/lib/whatsapp'
import { CONFIRMED_COMPANY_ADDRESS } from '@/lib/site-info'
import { createServerDataError } from '@/lib/server-errors'
import { isPreviewMode } from '@/lib/preview-mode'
import {
  confirmedCategoryDefaults,
  fallbackCatalogBrands,
  fallbackCatalogProducts,
} from '@/lib/product-catalog'

export type HomepageBrand = {
  name: string
  slug: string
}

export type HomepageCategory = {
  id: number | string
  title: string
  slug: string
  description: string | null
  image: Media | null
  fallbackImageSrc: string
  brands: HomepageBrand[]
}

export type HomepageProduct = {
  id: number | string
  name: string
  slug: string
  partNumber: string | null
  image: Media | null
  fallbackImageSrc: string | null
}

export type HomepageContact = {
  name: string
  role: string
  phone: string
}

export type HomepageSiteSettings = {
  companyName: string
  logo: Media | null
  address: string | null
  primaryPhone: string | null
  whatsappUrl: string | null
  contacts: HomepageContact[]
  socialLinks: NonNullable<SiteSetting['socialLinks']>
}

export type HomepageData = {
  categories: HomepageCategory[]
  featuredProducts: HomepageProduct[]
  siteSettings: HomepageSiteSettings
  contentSource: 'cms' | 'fallback'
}

const categoryPreviewContent: Record<
  (typeof confirmedCategoryDefaults)[number]['slug'],
  { description: string; image: string }
> = {
  'concrete-pump-parts': {
    description: 'قطع غيار لمضخات الخرسانة',
    image: '/images/home/category-pump.webp',
  },
  'concrete-mixer-parts': {
    description: 'قطع غيار الخلاطات الخرسانية',
    image: '/images/home/category-mixer-approved.webp',
  },
  'concrete-plant-parts': {
    description: 'قطع غيار لمحطات الخرسانة',
    image: '/images/home/category-batching-approved.webp',
  },
  'general-parts': {
    description: 'قطع غيار متنوعة لمعدات الخرسانة',
    image: '/images/home/about-parts.webp',
  },
}

const confirmedContacts: HomepageContact[] = [
  { name: 'عبدالرحمن', role: 'مبيعات', phone: '01031080031' },
  { name: 'منار', role: 'خدمة عملاء', phone: '01102100224' },
  { name: 'أحمد', role: 'مدير الحسابات', phone: '01031080048' },
  { name: 'هشام', role: 'مدير المبيعات', phone: '01031080083' },
  { name: 'حماده', role: 'مبيعات', phone: '01098630366' },
]

const fallbackPumpBrands: HomepageBrand[] = fallbackCatalogBrands.map((brand) => ({
  name: brand.name,
  slug: brand.slug,
}))

const fallbackSiteSettings: HomepageSiteSettings = {
  companyName: 'الفردوس',
  logo: null,
  address: CONFIRMED_COMPANY_ADDRESS,
  primaryPhone: PRIMARY_WHATSAPP_PHONE,
  whatsappUrl: toWhatsAppUrl(PRIMARY_WHATSAPP_PHONE),
  contacts: confirmedContacts,
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1CtRFEbbNJ/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/alfir_dous17?igsh=MXNxeTNrZmozNHI5bA=',
    tiktok: 'https://www.tiktok.com/@al_fairdous?_r=1&_t=ZS-98zWmAeqMKu',
  },
}

function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null && 'id' in value
}

function mapCategory(category: ProductCategory, brands: HomepageBrand[]): HomepageCategory {
  const preview = categoryPreviewContent[category.slug as keyof typeof categoryPreviewContent]

  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description ?? preview?.description ?? null,
    image: isMedia(category.image) ? category.image : null,
    fallbackImageSrc: preview?.image ?? '/images/home/about-parts.webp',
    brands,
  }
}

function buildFallbackCategories(): HomepageCategory[] {
  return confirmedCategoryDefaults.map((category, index) => ({
    id: `fallback-${category.slug}`,
    title: category.title,
    slug: category.slug,
    description: categoryPreviewContent[category.slug].description,
    image: null,
    fallbackImageSrc: categoryPreviewContent[category.slug].image,
    brands: index === 0 ? fallbackPumpBrands : [],
  }))
}

function mergeConfirmedCategories(
  categories: ProductCategory[],
  brands: HomepageBrand[],
): HomepageCategory[] {
  const categoryMap = new Map(categories.map((category) => [category.slug, category]))

  return confirmedCategoryDefaults.map((defaultCategory, index) => {
    const category = categoryMap.get(defaultCategory.slug)

    if (!category) {
      return {
        id: `fallback-${defaultCategory.slug}`,
        title: defaultCategory.title,
        slug: defaultCategory.slug,
        description: categoryPreviewContent[defaultCategory.slug].description,
        image: null,
        fallbackImageSrc: categoryPreviewContent[defaultCategory.slug].image,
        brands: index === 0 ? brands : [],
      }
    }

    return mapCategory(category, index === 0 ? brands : [])
  })
}

function mapProduct(product: Product): HomepageProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    partNumber: product.partNumber ?? null,
    image: isMedia(product.mainImage) ? product.mainImage : null,
    fallbackImageSrc: null,
  }
}

function mapSiteSettings(settings: SiteSetting | null): HomepageSiteSettings {
  if (!settings) return fallbackSiteSettings

  const primaryPhone = settings.primaryWhatsApp || settings.contacts?.[0]?.phone || PRIMARY_WHATSAPP_PHONE

  return {
    companyName: settings.companyName || fallbackSiteSettings.companyName,
    logo: isMedia(settings.logo) ? settings.logo : null,
    address: settings.address || fallbackSiteSettings.address,
    primaryPhone,
    whatsappUrl: toWhatsAppUrl(primaryPhone),
    contacts: settings.contacts?.map((contact) => ({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
    })) || fallbackSiteSettings.contacts,
    socialLinks: {
      facebook: settings.socialLinks?.facebook || fallbackSiteSettings.socialLinks.facebook,
      instagram: settings.socialLinks?.instagram || fallbackSiteSettings.socialLinks.instagram,
      tiktok: settings.socialLinks?.tiktok || fallbackSiteSettings.socialLinks.tiktok,
    },
  }
}

export async function getSiteSettings(): Promise<HomepageSiteSettings> {
  if (isPreviewMode()) return fallbackSiteSettings

  try {
    const payload = await withTimeout(getPayload({ config }), 2500)
    if (!payload) throw new Error('Payload connection timed out')

    const settings = await withTimeout(payload.findGlobal({ slug: 'site-settings', depth: 1 }), 2500)
    return mapSiteSettings(settings)
  } catch (error) {
    throw createServerDataError('Failed to load site settings', error)
  }
}

function buildFallbackHomepageData(): HomepageData {
  return {
    categories: buildFallbackCategories(),
    featuredProducts: fallbackCatalogProducts.slice(0, 6).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      partNumber: null,
      image: null,
      fallbackImageSrc: product.image,
    })),
    siteSettings: fallbackSiteSettings,
    contentSource: 'fallback',
  }
}

export async function getHomepageData(): Promise<HomepageData> {
  if (isPreviewMode()) {
    return buildFallbackHomepageData()
  }

  try {
    const payload = await withTimeout(getPayload({ config }), 2500)
    if (!payload) throw new Error('Payload connection timed out')

    const result = await withTimeout(
      Promise.all([
        payload.find({
          collection: 'product-categories',
          depth: 1,
          limit: 20,
          sort: 'sortOrder',
          where: { active: { equals: true } },
        }),
        payload.find({
          collection: 'brands',
          depth: 1,
          limit: 20,
          sort: 'name',
          where: { active: { equals: true } },
        }),
        payload.find({
          collection: 'products',
          depth: 1,
          limit: 6,
          sort: '-updatedAt',
          where: {
            and: [{ active: { equals: true } }, { featured: { equals: true } }],
          },
        }),
        payload.findGlobal({ slug: 'site-settings', depth: 1 }),
      ]),
      3500,
    )

    if (!result) throw new Error('Homepage content query timed out')

    const [categoryResult, brandResult, productResult, siteSettings] = result

    const cmsBrands = (brandResult.docs as Brand[]).filter((brand) => Boolean(brand.name && brand.slug))
    const pumpBrands = fallbackPumpBrands.map((fallbackBrand) => {
      const cmsBrand = cmsBrands.find((brand) => brand.name === fallbackBrand.name)
      return cmsBrand ? { name: cmsBrand.name, slug: cmsBrand.slug } : fallbackBrand
    })
    const cmsProducts = productResult.docs as Product[]

    return {
      categories: mergeConfirmedCategories(
        categoryResult.docs as ProductCategory[],
        pumpBrands,
      ),
      featuredProducts: cmsProducts.map(mapProduct),
      siteSettings: mapSiteSettings(siteSettings as SiteSetting),
      contentSource: 'cms',
    }
  } catch (error) {
    throw createServerDataError('Failed to load homepage data', error)
  }
}
