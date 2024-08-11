import { Config } from './types/config'
import { Endpoint } from './types/endpoint'
import { Options, PostOptions } from './types/options'
import { ResponseWrapper } from './types/responseWrapper'

export interface Api {
  config: Config
  loading: boolean
  activeRequests: number

  createUrl(path: string, mapQuery?: Map<string, any>): string
  get<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>>
  post<T>(url: Endpoint<string> | string, options?: PostOptions): Promise<ResponseWrapper<T>>
  put<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>>
  delete<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>>
}
