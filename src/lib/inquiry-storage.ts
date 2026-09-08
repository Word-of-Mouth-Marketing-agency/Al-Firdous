import { getPayload } from 'payload'

import config from '@payload-config'

export type InquiryInput = {
  name: string
  phone: string
  subject: string
  message: string
  source: string
}

export async function createInquiry(input: InquiryInput) {
  const payload = await getPayload({ config })
  return payload.create({
    collection: 'inquiries',
    data: {
      ...input,
      status: 'new',
    },
    overrideAccess: true,
  })
}
