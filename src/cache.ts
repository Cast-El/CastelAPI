import { ICache } from "./types/cache";
import { CachedValue } from "./types/cachedValue";

class Cache implements ICache {
  #store: Map<string, any>;

  constructor() {
    this.#store = new Map();
  }

  get<T>(key: string): CachedValue<T> | null {
    const data = this.#store.get(key);
    return data || null;
  }

  set<T>(key: string, value: T, cacheTime: number) {
    this.#store.set(key, {
      data: value as T,
      timeStamp: Date.now() + cacheTime,
    });
  }

  clear() {
    this.#store.clear();
  }

  delete(key: string) {
    this.#store.delete(key);
  }
}

export default Cache;
