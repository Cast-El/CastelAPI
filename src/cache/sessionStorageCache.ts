import { Cache } from '../types/cache'
import { CachedValue } from '../types/cachedValue'
import { isExpired } from './commons'

export default class SessionStorageCache implements Cache {
  constructor() {
    if (!window || !window.sessionStorage) {
      throw new Error('sessionStorage not supported')
    }
  }

  get<T>(key: string): CachedValue<T> | null {
    const data = window.sessionStorage.getItem(key)
    let jsonData: CachedValue<T> | null = null
    try {
      jsonData = data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Error parsing JSON from localStorage', e)
      return null
    }
    const isExpired = this.isExpired(jsonData)
    if (isExpired) {
      this.delete(key)
      return null
    }
    return jsonData as CachedValue<T>
  }

  set<T>(key: string, value: T, cacheTime: number) {
    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        data: value as T,
        timeStamp: Date.now() + cacheTime,
      }),
    )
  }

  clear() {
    window.sessionStorage.clear()
  }

  delete(key: string) {
    window.sessionStorage.removeItem(key)
  }

  isExpired<T>(cachedResponse: CachedValue<T> | null): boolean {
   return isExpired(cachedResponse)
  }
}