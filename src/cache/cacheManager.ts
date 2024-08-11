import { Cache } from '../types/cache'

export default class CacheManager implements Cache {
  cacheStrategy: Cache
  #error = 'Cache strategy must be provided'

  constructor(cacheStrategy: Cache) {
    if (!cacheStrategy) {
      throw new Error(this.#error)
    }
    this.cacheStrategy = cacheStrategy
  }

  setStrategy(cacheStrategy: Cache | null) {
    if (!cacheStrategy) {
      throw new Error(this.#error)
    }
    this.cacheStrategy = cacheStrategy
  }

  get<T>(key: string): T | null {
    return this.cacheStrategy.get(key)
  }

  set<T>(key: string, value: T, cacheTime: number) {
    this.cacheStrategy.set(key, value, cacheTime)
  }

  clear() {
    this.cacheStrategy.clear()
  }

  delete(key: string) {
    this.cacheStrategy.delete(key)
  }

  isExpired<T>(cachedResponse: T | null): boolean {
    return this.cacheStrategy.isExpired(cachedResponse)
  }
}
