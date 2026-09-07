import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'partNumber', 'category', 'active', 'updatedAt'],
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
    { name: 'partNumber', type: 'text', label: 'Part number / SKU' },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'description', type: 'richText' },
    { name: 'category', type: 'relationship', relationTo: 'product-categories', required: true },
    { name: 'brand', type: 'relationship', relationTo: 'brands' },
    {
      name: 'compatibleModels',
      type: 'array',
      fields: [{ name: 'model', type: 'text', required: true }],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'mainImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'specifications',
      type: 'array',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'availability',
      type: 'select',
      defaultValue: 'on-request',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'On request', value: 'on-request' },
        { label: 'Discontinued', value: 'discontinued' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
