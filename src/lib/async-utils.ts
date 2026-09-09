export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let timedOut = false

  const guardedPromise = promise.then(
    (value) => value,
    (error) => {
      if (timedOut) return null
      throw error
    },
  )
  const timeout = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => {
      timedOut = true
      resolve(null)
    }, timeoutMs)
  })

  try {
    return await Promise.race([guardedPromise, timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}
