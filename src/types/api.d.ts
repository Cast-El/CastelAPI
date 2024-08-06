import Cache from "../cache";
import { createUrlWithQuery, isEndpoint } from "./commons";
import { parseResponse } from "./parser";
import { IApi } from "./types/api";
import { Config } from "./types/config";
import { Endpoint } from "./types/endpoint";
import { Options, PostOptions } from "./types/options";
import { ResponseWrapper } from "./types/responseWrapper";

export interface IApi {
  config: Config;
  cache: Cache;
  loading: boolean;
  activeRequests: number;

  createUrl(path: string, mapQuery?: Map<string, any>): string;
  get<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>>;
  post<T>(url: Endpoint<string> | string, options?: PostOptions): Promise<ResponseWrapper<T>>;
  put<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>>;
  delete<T>(url: Endpoint<string> | string, options?: Options): Promise<ResponseWrapper<T>>;
}