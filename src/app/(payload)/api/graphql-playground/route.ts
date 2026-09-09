/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'
import { isVercelClientPreview } from '@/lib/preview-mode'

type GraphqlPlaygroundHandler = ReturnType<typeof GRAPHQL_PLAYGROUND_GET>
const unavailable: GraphqlPlaygroundHandler = async () => new Response(null, { status: 404 })

export const GET = isVercelClientPreview() ? unavailable : GRAPHQL_PLAYGROUND_GET(config)
