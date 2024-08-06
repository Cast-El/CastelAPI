import { CachedValue } from "./types/cachedValue";

export interface CachedValue<T> {
    data: T;
    timeStamp: number;
  }
  
  export interface ICache {
    get<T>(key: string): CachedValue<T> | null;
    set<T>(key: string, value: T, cacheTime: number): void;
    clear(): void;
    delete(key: string): void;
  }
  