import { CachedValue } from './types/cachedValue'

export type CachedValue<T> ={
  data: T
  timeStamp: number
}

export interface Cache {
  get<T>(key: string): CachedValue<T> | null
  set<T>(key: string, value: T, cacheTime: number): void
  isExpired(cachedResponse: CachedValue): boolean
  clear(): void
  delete(key: string): void
}
