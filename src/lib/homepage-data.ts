import { getPayload } from 'payload'

import config from '@payload-config'
import type { Brand, Media, Product, ProductCategory, SiteSetting } from '@/payload-types'

export type HomepageCategory = {
  id: number | string
  title: string
  slug: string
  description: string | null
  image: Media | null
  brandNames: string[]
}

export type HomepageSiteSettings = {
  companyName: string
  logo: Media | null
  primaryPhone: string | null
  whatsappUrl: string | null
  socialLinks: NonNullable<SiteSetting['socialLinks']>
}

export type HomepageData = {
  categories: HomepageCategory[]
  featuredProducts: Product[]
  siteSettings: HomepageSiteSettings
  contentSource: 'cms' | 'fallback'
}

const confirmedCategoryDefaults = [
  { title: 'قطع غيار مضخات الخرسانة', slug: 'concrete-pump-parts' },
  { title: 'قطع غيار خلاطات الخرسانة', slug: 'concrete-mixer-parts' },
  { title: 'قطع غيار محطات الخرسانة', slug: 'concrete-plant-parts' },
  { title: 'قطع غيار عامة', slug: 'general-parts' },
] as const

const confirmedPumpBrands = ['Zoomlion', 'Schwing', 'Putzmeister'] as const

const confirmedContacts = [
  { name: 'عبدالرحمن', role: 'مبيعات', phone: '01031080031' },
  { name: 'منار', role: 'خدمة عملاء', phone: '01102100224' },
  { name: 'أحمد', role: 'مدير الحسابات', phone: '01031080048' },
  { name: 'هشام', role: 'مدير المبيعات', phone: '01031080083' },
  { name: 'حماده', role: 'مبيعات', phone: '01098630366' },
]

const fallbackSiteSettings: HomepageSiteSettings = {
  companyName: 'الفردوس',
  logo: null,
  primaryPhone: confirmedContacts[0]?.phone ?? null,
  whatsappUrl: toWhatsAppUrl(confirmedContacts[0]?.phone),
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1CtRFEbbNJ/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/alfir_dous17?igsh=MXNxeTNrZmozNHI5bA=',
    tiktok: 'https://www.tiktok.com/@al_fairdous?_r=1&_t=ZS-98zWmAeqMKu',
  },
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const guardedPromise = promise.catch(() => null)

  const timeout = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), timeoutMs)
  })

  try {
    return await Promise.race([guardedPromise, timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null && 'id' in value
}

function toWhatsAppUrl(phone: string | null | undefined) {
  if (!phone) return null

  const digits = phone.replace(/\D/g, '')
  if (!digits) return null

  const internationalNumber = digits.startsWith('0') ? `20${digits.slice(1)}` : digits
  return `https://wa.me/${internationalNumber}`
}

function mapCategory(category: ProductCategory, brandNames: string[]): HomepageCategory {
  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description ?? null,
    image: isMedia(category.image) ? category.image : null,
    brandNames,
  }
}

function buildFallbackCategories(): HomepageCategory[] {
  return confirmedCategoryDefaults.map((category, index) => ({
    id: `fallback-${category.slug}`,
    title: category.title,
    slug: category.slug,
    description: null,
    image: null,
    brandNames: index === 0 ? [...confirmedPumpBrands] : [],
  }))
}

function mergeConfirmedCategories(
  categories: ProductCategory[],
  brandNames: string[],
): HomepageCategory[] {
  const categoryMap = new Map(categories.map((category) => [category.slug, category]))

  return confirmedCategoryDefaults.map((defaultCategory, index) => {
    const category = categoryMap.get(defaultCategory.slug)

    if (!category) {
      return {
        id: `fallback-${defaultCategory.slug}`,
        title: defaultCategory.title,
        slug: defaultCategory.slug,
        description: null,
        image: null,
        brandNames: index === 0 ? brandNames : [],
      }
    }

    return mapCategory(category, index === 0 ? brandNames : [])
  })
}

function mapSiteSettings(settings: SiteSetting | null): HomepageSiteSettings {
  if (!settings) return fallbackSiteSettings

  const primaryPhone = settings.primaryWhatsApp || settings.contacts?.[0]?.phone || null

  return {
    companyName: settings.companyName || fallbackSiteSettings.companyName,
    logo: isMedia(settings.logo) ? settings.logo : null,
    primaryPhone,
    whatsappUrl: toWhatsAppUrl(primaryPhone),
    socialLinks: {
      facebook: settings.socialLinks?.facebook || fallbackSiteSettings.socialLinks.facebook,
      instagram: settings.socialLinks?.instagram || fallbackSiteSettings.socialLinks.instagram,
      tiktok: settings.socialLinks?.tiktok || fallbackSiteSettings.socialLinks.tiktok,
    },
  }
}

export async function getHomepageData(): Promise<HomepageData> {
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

    const brandNames = (brandResult.docs as Brand[]).map((brand) => brand.name).filter(Boolean)

    return {
      categories: mergeConfirmedCategories(
        categoryResult.docs as ProductCategory[],
        brandNames.length ? brandNames : [...confirmedPumpBrands],
      ),
      featuredProducts: productResult.docs as Product[],
      siteSettings: mapSiteSettings(siteSettings as SiteSetting),
      contentSource: 'cms',
    }
  } catch {
    return {
      categories: buildFallbackCategories(),
      featuredProducts: [],
      siteSettings: fallbackSiteSettings,
      contentSource: 'fallback',
    }
  }
}
