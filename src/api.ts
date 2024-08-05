import Cache from "./cache";
import { createUrlWithQuery, isEndpoint } from "./commons";
import { parseResponse } from "./parser";
import { Endpoint } from "./types/endpoint";
import { Options, PostOptions } from "./types/options";
import { ResponseWrapper } from "./types/responseWrapper";

export const METHODS = {
  post: "POST",
  get: "GET",
  put: "PUT",
  delete: "DELETE",
};

type Methods = "POST" | "GET" | "PUT" | "DELETE";

class Api {
  public config = { baseUrl: "", headers: {} };
  public cache: Cache;
  public loading: boolean = false;

  constructor() {
    this.cache = new Cache();
  }

  async #useApi(
    method: Methods,
    url: string,
    paramsOptions?: Options
  ): Promise<any> {
    this.loading = true;
    console.log(this.loading)
    const options: Options = this._updateOptions(method, paramsOptions);
    try {
      const response = await fetch(url, options as RequestInit);
      return parseResponse(response);
    } catch (error: any) {
      if (paramsOptions?.retry) {
        paramsOptions.retry--;
        return this.#useApi(method, url, paramsOptions);
      }
      error.response = await parseResponse(error);
      throw error;
    } finally {
      this.loading = false;
      console.log(this.loading)
    }
  }

  private _updateOptions(
    method: Methods,
    paramsOptions: Options | undefined
  ): Options {
    let headers;
    if (paramsOptions?.headers || this.config?.headers) {
      headers = this._updateHeaders(paramsOptions?.headers);
    }
    const options: Options = {
      method,
      headers,
    };
    if (!paramsOptions && !this.config) {
      return options;
    }
    let body;
    if (paramsOptions?.body) {
      body = this._updateBody(paramsOptions.body);
      if (body) {
        options.body = body;
      }
    }
    return options;
  }

  private _updateHeaders(
    paramsHeaders: Record<string, any> | undefined | null
  ): Record<string, any> {
    let headers: { [key: string]: any } = this.config?.headers || {};
    if (paramsHeaders) {
      paramsHeaders.forEach((value: any, key: string) => {
        headers[key] = value;
      });
    }
    return headers || null;
  }

  private _updateBody(body: Record<string, any>): any {
    if (!body) {
      return;
    }
    const doNotFormatPayload =
      body instanceof FormData || typeof body === "string";
    if (doNotFormatPayload) {
      return body;
    }
    const formatPayload = Object.keys(body).length > 0;
    if (formatPayload) {
      return JSON.stringify(body);
    }
  }

  createUrl(path: string, mapQuery?: Map<string, any>): string {
    if (mapQuery) {
      return createUrlWithQuery(path, mapQuery);
    }
    return path;
  }

  get<T>(
    url: Endpoint<string> | string,
    options?: Options
  ): Promise<ResponseWrapper<T>> {
   return this.#useApi(METHODS.get as Methods, url, options);
  }

  post<T>(
    url: Endpoint<string> | string,
    options?: PostOptions
  ): Promise<ResponseWrapper<T>> {
    return this.#useApi(
      METHODS.post as Methods,
      this.createUrl(url, options?.parameters),
      options
    );
  }

  put<T>(
    url: Endpoint<string> | string,
    options?: Options
  ): Promise<ResponseWrapper<T>> {
    return this.#useApi(
      METHODS.put as Methods,
      this.createUrl(url, options?.parameters),
      options
    );
  }

  delete<T>(
    url: Endpoint<string> | string,
    options?: Options
  ): Promise<ResponseWrapper<T>> {
    if (isEndpoint(url)) {
      url = this.config.baseUrl + url;
    }
    return this.#useApi(
      METHODS.delete as Methods,
      this.createUrl(url, options?.parameters),
      options
    );
  }
}

export default Api;