import { Endpoint } from "./types/endpoint";
export declare const createUrlWithQuery: (url: string, mapQuery: Map<string, any>) => string;
export declare const isEndpoint: (url: string) => url is Endpoint<string>;
