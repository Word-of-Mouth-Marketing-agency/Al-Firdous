import type { GlobalConfig } from 'payload'

import { PRIMARY_WHATSAPP_PHONE } from '../lib/whatsapp'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'إعدادات الموقع',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'الفردوس' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'contacts',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
      defaultValue: [
        { name: 'عبدالرحمن', role: 'مبيعات', phone: '01031080031' },
        { name: 'منار', role: 'خدمة عملاء', phone: '01102100224' },
        { name: 'أحمد', role: 'مدير الحسابات', phone: '01031080048' },
        { name: 'هشام', role: 'مدير المبيعات', phone: '01031080083' },
        { name: 'حماده', role: 'مبيعات', phone: '01098630366' },
      ],
    },
    {
      name: 'primaryWhatsApp',
      type: 'text',
      defaultValue: PRIMARY_WHATSAPP_PHONE,
      admin: { description: 'Primary number used for the homepage WhatsApp action.' },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          defaultValue: 'https://www.facebook.com/share/1CtRFEbbNJ/?mibextid=wwXIfr',
        },
        {
          name: 'instagram',
          type: 'text',
          defaultValue: 'https://www.instagram.com/alfir_dous17?igsh=MXNxeTNrZmozNHI5bA=',
        },
        {
          name: 'tiktok',
          type: 'text',
          defaultValue: 'https://www.tiktok.com/@al_fairdous?_r=1&_t=ZS-98zWmAeqMKu',
        },
      ],
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'الفردوس | قطع غيار معدات الخرسانة' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة.',
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
