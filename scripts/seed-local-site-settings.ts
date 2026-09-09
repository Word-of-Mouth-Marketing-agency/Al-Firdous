import fs from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import type { SiteSetting } from '../src/payload-types'
import { CONFIRMED_COMPANY_ADDRESS } from '../src/lib/site-info'

const logoPath = path.resolve(process.env.LOCAL_SITE_LOGO_PATH || 'A:/Downloads/logo.png')

const payload = await getPayload({ config })

let logoId: number | undefined
try {
  const logo = await fs.readFile(logoPath)
  const filename = path.basename(logoPath)
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })

  if (existing.docs[0]) {
    logoId = Number(existing.docs[0].id)
  } else {
    const created = await payload.create({
      collection: 'media',
      data: { alt: 'شعار الفردوس' },
      file: {
        data: logo,
        mimetype: 'image/png',
        name: filename,
        size: logo.byteLength,
      },
    })
    logoId = Number(created.id)
  }
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  console.log(`Logo not found; leaving SiteSettings.logo empty: ${logoPath}`)
}

const data: Partial<SiteSetting> = {
  companyName: 'الفردوس',
  address: CONFIRMED_COMPANY_ADDRESS,
  contacts: [
    { name: 'عبدالرحمن', role: 'مبيعات', phone: '01031080031' },
    { name: 'منار', role: 'خدمة عملاء', phone: '01102100224' },
    { name: 'أحمد', role: 'مدير الحسابات', phone: '01031080048' },
    { name: 'هشام', role: 'مدير المبيعات', phone: '01031080083' },
    { name: 'حماده', role: 'مبيعات', phone: '01098630366' },
  ],
  primaryWhatsApp: '01031080031',
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1CtRFEbbNJ/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/alfir_dous17?igsh=MXNxeTNrZmozNHI5bA=',
    tiktok: 'https://www.tiktok.com/@al_fairdous?_r=1&_t=ZS-98zWmAeqMKu',
  },
  defaultSeo: {
    title: 'الفردوس | قطع غيار معدات الخرسانة',
    description: 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة.',
  },
}

if (logoId) data.logo = logoId

const settings = await payload.updateGlobal({
  slug: 'site-settings',
  data,
  depth: 0,
})

console.log(
  JSON.stringify({
    global: 'site-settings',
    companyName: settings.companyName,
    address: settings.address,
    contacts: settings.contacts?.length ?? 0,
    primaryWhatsApp: settings.primaryWhatsApp,
    logoConfigured: Boolean(settings.logo),
    socialLinks: Object.keys(settings.socialLinks || {}),
  }),
)

await payload.db.destroy?.()
process.exit(0)
