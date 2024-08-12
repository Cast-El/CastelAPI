import { Cache } from '../types/cache'
import { CachedValue } from '../types/cachedValue'
import { isExpired } from './commons'

export default class InstanceCache implements Cache {
  #store: Map<string, any>

  constructor() {
    this.#store = new Map()
  }

  get<T>(key: string): CachedValue<T> | null {
    const data: CachedValue<T> = this.#store.get(key)
    const isExpired =this.isExpired(data)
    if(isExpired){
      this.delete(key)
      return null
    }
    return data
  }

  set<T>(key: string, data: T, cacheTime: number) {
    this.#store.set(key, {
      data,
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
