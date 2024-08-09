import { isEndpoint } from './commons'
import { Endpoint } from './types/endpoint'
import { Options, PostOptions } from './types/options'
import { ResponseWrapper } from './types/responseWrapper'
import Api from './api'

export const apiInstance = new Api()
export const config = apiInstance.config
export const loading = () => apiInstance.loading

export async function get<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url
  }
  const cachedResponse = apiInstance.cache.get<T>(url)
  if (cachedResponse) {
    const currentTime = Date.now()
    const isExpired = cachedResponse.timeStamp - currentTime <= 0
    if (!isExpired) {
      return cachedResponse
    }
    apiInstance.cache.delete(url)
  }
  const response = await apiInstance.get<T>(url, options)
  if (options?.cache?.enabled && options?.cache?.cacheTime) {
    apiInstance.cache.set(url, response, options.cache.cacheTime)
  }
  return response
}

export function post<T>(url: Endpoint<string> | string, options?: PostOptions): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url
  }
  return apiInstance.post<T>(url, options)
}

export function put<T>(url: Endpoint<string> | string, options?: PostOptions): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url
  }
  return apiInstance.put<T>(url, options)
}

export function remove<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url
  }
  return apiInstance.delete<T>(url, options)
}
