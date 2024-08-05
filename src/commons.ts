import { Endpoint } from "./types/endpoint";


export const createUrlWithQuery = (
  url: string,
  mapQuery: Map<string, any>
): string => {
  const params = new URLSearchParams();
  for (const [key, value] of mapQuery) {
    if (value !== null) {
      params.append(key, value);
    }
  }
  return `${url}?${params.toString()}`;
};

export const isEndpoint = (url: string): url is Endpoint<string> => {
  return url.startsWith("/");
};
