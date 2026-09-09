const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000

const attemptsByClient = new Map<string, number[]>()

export function getInquiryClientKey(
  requestHeaders: Headers,
  environment: NodeJS.ProcessEnv = process.env,
) {
  if (environment.TRUST_PROXY !== 'true') return 'untrusted-client'

  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = requestHeaders.get('x-real-ip')?.trim()
  return forwardedFor || realIp || 'unknown-client'
}

export function checkInquiryRateLimit(clientKey: string, now = Date.now()) {
  const recentAttempts = (attemptsByClient.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  )

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    attemptsByClient.set(clientKey, recentAttempts)
    return false
  }

  recentAttempts.push(now)
  attemptsByClient.set(clientKey, recentAttempts)
  return true
}

export function resetInquiryRateLimitForTests() {
  attemptsByClient.clear()
}
