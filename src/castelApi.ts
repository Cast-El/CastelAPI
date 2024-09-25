import { Options, PostOptions } from './types/options'
import { ResponseWrapper } from './types/responseWrapper'
import CrudApi from './crudApi'
import InstanceCache from './cache/instanceCache'
import LocalStorageCache from './cache/localStorageCache'
import SessionStorageCache from './cache/sessionStorageCache'
import CacheManager from './cache/cacheManager'

export const apiInstance = new CrudApi()
/**
 * API instance configuration.
 */
export const config = apiInstance.config
/**
 * Checks if the API is currently loading.
 * @returns {boolean} - `true` if the API is loading, otherwise `false`.
 */
export const loading = () => apiInstance.loading

export const instanceCache = new InstanceCache()
export const localStorageCache = typeof window !== 'undefined' ? new LocalStorageCache() : null
export const sessionStorageCache = typeof window !== 'undefined' ? new SessionStorageCache() : null
export const cache = new CacheManager(instanceCache)

/**
 * Sets the cache strategy.
 * @param {Cache} cacheStrategy - The cache strategy to use.
 */
export const setCacheStrategy = (cacheStrategy: InstanceCache | LocalStorageCache | SessionStorageCache | null) => {
  cache.setStrategy(cacheStrategy)
}

/**
 * Fetches data from the specified URL.
 * @param {string} url - The endpoint or URL to fetch data from.
 * @param {Options} [options] - The request options.
 * @returns {Promise<ResponseWrapper<T>>} - A promise that resolves with the fetched data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function get<T>(url: string | string, options?: Options): Promise<ResponseWrapper<T>> {
  if (apiInstance.config.baseUrl) {
    url = apiInstance.config.baseUrl + url
  }
  const cachedResponse = cache.get<ResponseWrapper<T>>(url) as ResponseWrapper<T> | null
  if (cachedResponse) {
    return cachedResponse
  }
  const response = await apiInstance.get<T>(url, options)
  storeToCacheIfEnabled<T>(url, response, options)
  return response
}

/**
 * Sends data to the specified URL using the POST method.
 * @param {string} url - The endpoint or URL to send data to.
 * @param {PostOptions} [options] - The request options.
 * @returns {Promise<ResponseWrapper<T>>} - A promise that resolves with the server response.
 */
export function post<T>(url: string, options?: PostOptions): Promise<ResponseWrapper<T>> {
  if (apiInstance.config.baseUrl) {
    url = apiInstance.config.baseUrl + url
  }
  return apiInstance.post<T>(url, options)
}

/**
 * Updates data at the specified URL using the PUT method.
 * @param {string} url - The endpoint or URL to send data to.
 * @param {PostOptions} [options] - The request options.
 * @returns {Promise<ResponseWrapper<T>>} - A promise that resolves with the server response.
 */
export function put<T>(url: string, options?: PostOptions): Promise<ResponseWrapper<T>> {
  if (apiInstance.config.baseUrl) {
    url = apiInstance.config.baseUrl + url
  }
  return apiInstance.put<T>(url, options)
}

/**
 * Deletes data at the specified URL using the DELETE method.
 * @param {string} url - The endpoint or URL to send data to.
 * @param {Options} [options] - The request options.
 * @returns {Promise<ResponseWrapper<T>>} - A promise that resolves with the server response.
 */
export function remove<T>(url: string, options?: Options): Promise<ResponseWrapper<T>> {
  if (apiInstance.config.baseUrl) {
    url = apiInstance.config.baseUrl + url
  }
  return apiInstance.delete<T>(url, options)
}

/**
 * Stores the response in the cache if the cache option is enabled.
 * @param {string} url - The request URL.
 * @param {ResponseWrapper<T>} response - The request response.
 * @param {Options} [options] - The request options.
 */
function storeToCacheIfEnabled<T>(url: string, response: ResponseWrapper<T>, options?: Options) {
  if (options?.cache?.enabled && options?.cache?.cacheTime) {
    cache.set<ResponseWrapper<T>>(url, response, options.cache.cacheTime)
  }
}
