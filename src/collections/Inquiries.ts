import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'subject', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'phone', type: 'text', required: true, maxLength: 30 },
    { name: 'subject', type: 'text', maxLength: 160 },
    { name: 'message', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'source', type: 'text', defaultValue: 'contact-form', maxLength: 80 },
    { name: 'relatedProduct', type: 'relationship', relationTo: 'products' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
