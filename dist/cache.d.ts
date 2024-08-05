import { CachedValue } from "./types/cachedValue";
declare class Cache {
    #private;
    constructor();
    get<T>(key: string): CachedValue<T> | null;
    set<T>(key: string, value: T): void;
    clear(): void;
    delete(key: string): void;
}
export default Cache;
