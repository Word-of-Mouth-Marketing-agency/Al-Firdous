export function createServerDataError(context: string, error: unknown): Error {
  const detail = error instanceof Error ? error.message : String(error ?? 'Unknown error')
  return new Error(`${context}: ${detail}`, { cause: error })
}
