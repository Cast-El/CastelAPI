import { createUrlWithQuery } from './commons'
import { parseResponse } from './parser'
import { Api } from './types/api'
import { Config } from './types/config'
import { Options, PostOptions } from './types/options'
import { ResponseWrapper } from './types/responseWrapper'

export const METHODS = {
  post: 'POST',
  get: 'GET',
  put: 'PUT',
  delete: 'DELETE',
}

type Methods = 'POST' | 'GET' | 'PUT' | 'DELETE'

export default class CrudApi implements Api {
  CONTENT_TYPE = 'Content-Type'
  APPLICATION_JSON = 'application/json'
  doNotFormatPayload: boolean = false
  public config: Config = {
    baseUrl: '',
    headers: {},
  }
  public loading: boolean = false
  public activeRequests: number = 0

  async #useApi<T>(method: Methods, url: string, paramsOptions?: Options): Promise<ResponseWrapper<T>> {
    this.activeRequests++
    this.loading = true
    const options: Options = this._updateOptions(method, paramsOptions)
    try {
      const response: Response = await fetch(url, options as RequestInit)
      const result = await parseResponse<T>(response)
      return this.useResponseInterceptor<T>(result)
    } catch (error: any) {
      if (paramsOptions?.retry) {
        paramsOptions.retry--
        return this.#useApi(method, url, paramsOptions)
      }
      error.response = await parseResponse(error)
      throw error
    } finally {
      this.activeRequests--
      if (this.activeRequests === 0) {
        this.loading = false
      }
    }
  }

  private _updateOptions(method: Methods, paramsOptions: PostOptions | undefined): PostOptions {
    const hasHeaders = paramsOptions?.headers || this.config?.headers
    if (paramsOptions?.body) {
      this.doNotFormatPayload = paramsOptions.body instanceof FormData || typeof paramsOptions.body === 'string'
    }
    const body = paramsOptions?.body ? this._updateBody(paramsOptions.body) : undefined
    const headers = hasHeaders ? this._updateHeaders(paramsOptions?.headers) : undefined
    return { method, headers, body }
  }

  private _updateHeaders(paramsHeaders: Record<string, string> | undefined | null): Record<string, string> {
    const headers: Record<string, string> = { ...this.config.headers }
    let hasContentType = false
    const lowerCaseContentType = this.CONTENT_TYPE.toLowerCase()
    if (paramsHeaders) {
      Object.keys(paramsHeaders).forEach((key: string) => {
        if (key.toLowerCase() === lowerCaseContentType) {
          hasContentType = true
        }
        headers[key] = paramsHeaders[key]
      })
    }
    if (!hasContentType && !this.doNotFormatPayload) {
      headers[this.CONTENT_TYPE] = this.APPLICATION_JSON
    }
    return headers
  }

  private _updateBody(body: Record<string, any>): any {
    if (this.doNotFormatPayload) {
      return body
    }
    const formatPayload = Object.keys(body).length > 0
    if (formatPayload) {
      return JSON.stringify(body)
    }
  }

  createUrl(path: string, mapQuery?: Map<string, any>): string {
    if (mapQuery) {
      return createUrlWithQuery(path, mapQuery)
    }
    return path
  }

  get<T>(url: string, options?: Options): Promise<ResponseWrapper<T>> {
    return this.#useApi<T>(METHODS.get as Methods, this.createUrl(url, options?.parameters), options)
  }

  post<T>(url: string, options?: PostOptions): Promise<ResponseWrapper<T>> {
    return this.#useApi<T>(METHODS.post as Methods, this.createUrl(url, options?.parameters), options)
  }

  put<T>(url: string, options?: PostOptions): Promise<ResponseWrapper<T>> {
    return this.#useApi<T>(METHODS.put as Methods, this.createUrl(url, options?.parameters), options)
  }

  delete<T>(url: string, options?: Options): Promise<ResponseWrapper<T>> {
    return this.#useApi<T>(METHODS.delete as Methods, this.createUrl(url, options?.parameters), options)
  }

  useResponseInterceptor<T>(response: ResponseWrapper<T>): ResponseWrapper<T> {
    if (this.config?.responseInterceptor) {
      return this.config.responseInterceptor(response)
    }
    return response
  }
}
