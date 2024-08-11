import type { CachedValue } from '../types/cache'

export function isExpired<T>(cachedResponse: CachedValue<T> | null): boolean {
  if (!cachedResponse) {
    return false
  }
  const currentTime = Date.now()
  return cachedResponse.timeStamp - currentTime <= 0
}
