import { isEndpoint } from "./commons";
import { Endpoint } from "./types/endpoint";
import { Options } from "./types/options";
import { ResponseWrapper } from "./types/responseWrapper";

import apiInstance from "./apiInstance";

export const getLoading = () => {
  return apiInstance.loading;
};

export const setLoading = (value: boolean) => {
  apiInstance.loading = value;
};

export const getConfig = () => {
  return apiInstance.config;
};

export const setConfig = (value: {
  baseUrl: string;
  headers: Record<string, string>;
}) => {
  apiInstance.config = value;
};
export async function get<T>(
  url: string,
  options?: Options
): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url;
  }
  const cachedResponse = apiInstance.cache.get<T>(url);
  if (cachedResponse) {
    const currentTime = Date.now();
    if (currentTime - cachedResponse.timeStamp) {
      return cachedResponse;
    } else {
      apiInstance.cache.delete(url);
    }
  }
  const response = await apiInstance.get<T>(url, options);
  if (options?.cache?.enabled && options?.cache?.cacheTime) {
    apiInstance.cache.set(url, response, options.cache.cacheTime);
  }
  return response;
}

export function post<T>(
  url: Endpoint<string> | string,
  options?: Options
): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url;
  }
  return apiInstance.post<T>(url, options);
}

export function put<T>(
  url: Endpoint<string> | string,
  options?: Options
): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url;
  }
  return apiInstance.put<T>(url, options);
}

export function remove<T>(
  url: Endpoint<string> | string,
  options?: Options
): Promise<ResponseWrapper<T>> {
  if (isEndpoint(url)) {
    url = apiInstance.config.baseUrl + url;
  }
  return apiInstance.delete<T>(url, options);
}
