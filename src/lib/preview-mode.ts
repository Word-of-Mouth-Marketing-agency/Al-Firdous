type Environment = NodeJS.ProcessEnv

export function isVercelClientPreview(environment: Environment = process.env) {
  return environment.VERCEL_CLIENT_PREVIEW === 'true'
}

export function isPreviewMode(environment: Environment = process.env) {
  return (
    isVercelClientPreview(environment) || environment.HOMEPAGE_PREVIEW_CONTENT === 'true'
  )
}
