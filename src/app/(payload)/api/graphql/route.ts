/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'
import { isVercelClientPreview } from '@/lib/preview-mode'

type GraphqlPostHandler = ReturnType<typeof GRAPHQL_POST>
const unavailablePost: GraphqlPostHandler = async () => new Response(null, { status: 404 })

export const POST = isVercelClientPreview() ? unavailablePost : GRAPHQL_POST(config)

type RestOptionsHandler = ReturnType<typeof REST_OPTIONS>
const unavailableOptions: RestOptionsHandler = async () => new Response(null, { status: 404 })

export const OPTIONS = isVercelClientPreview() ? unavailableOptions : REST_OPTIONS(config)
