import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'active', 'updatedAt'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'description', type: 'textarea' },
  ],
}
