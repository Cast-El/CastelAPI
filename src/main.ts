import { isEndpoint } from "./commons";
import { Endpoint } from "./types/endpoint";
import { Options } from "./types/options";
import Api from "./api";

const api = new Api();

export const loading = api.loading;
export const config = api.config;

export async function get<T>(url: string, options?: Options): Promise<T> {
  if (options?.cache?.useCache) {
    const cachedResponse = api.cache.get<T>(url);
    if (cachedResponse) {
        const currentTime = Date.now();
        const cacheTime = options.cache.cacheTime;
        if (currentTime - cachedResponse.timeStamp < cacheTime) {
          return cachedResponse.data;
        } else {
          api.cache.delete(url);
        }
      }
  }
  const response = await api.get<T>(url, options);
  if (options?.cache) api.cache.set(url, response);
  return response;
}

export function post<T>(
    url: Endpoint<string> | string,
    options?: Options
): Promise<T> {
  return api.post<T>(url, options);
}

export function put<T>(
    url: Endpoint<string> | string,
    options?: Options
):  Promise<T> {
  return api.put<T>(url, options);
}

export function remove<T>(
  url: Endpoint<string> | string,
  options?: Options
): Promise<T> {
  if (isEndpoint(url)) {
    url = api.config.baseUrl + url;
  }
  return api.delete<T>(url, options);
}
