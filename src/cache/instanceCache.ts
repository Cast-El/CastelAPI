import { Cache } from '../types/cache'
import { CachedValue } from '../types/cachedValue'
import { isExpired } from './commons'

export default class InstanceCache implements Cache {
  #store: Map<string, any>

  constructor() {
    this.#store = new Map()
  }

  get<T>(key: string): CachedValue<T> | null {
    const data = this.#store.get(key)
    const isExpired =this.isExpired(data)
    if(isExpired){
      this.delete(key)
      return null
    }
    return data as CachedValue<T>
  }

  set<T>(key: string, value: T, cacheTime: number) {
    this.#store.set(key, {
      value: value as T,
      timeStamp: Date.now() + cacheTime,
    })
  }

  clear() {
    this.#store.clear()
  }

  delete(key: string) {
    this.#store.delete(key)
  }

  isExpired<T>(cachedResponse: CachedValue<T> | null): boolean {
    return isExpired(cachedResponse)
   }
}
