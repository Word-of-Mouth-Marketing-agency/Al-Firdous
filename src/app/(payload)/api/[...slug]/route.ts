/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { isVercelClientPreview } from '@/lib/preview-mode'

type RestHandler = ReturnType<typeof REST_GET>
const unavailable: RestHandler = async () => new Response(null, { status: 404 })

export const GET = isVercelClientPreview() ? unavailable : REST_GET(config)
export const POST = isVercelClientPreview() ? unavailable : REST_POST(config)
export const DELETE = isVercelClientPreview() ? unavailable : REST_DELETE(config)
export const PATCH = isVercelClientPreview() ? unavailable : REST_PATCH(config)
export const PUT = isVercelClientPreview() ? unavailable : REST_PUT(config)
export const OPTIONS = isVercelClientPreview() ? unavailable : REST_OPTIONS(config)
