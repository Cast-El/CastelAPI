import { Endpoint } from "./types/endpoint";
import { Options } from "./types/options";
export declare const loading: boolean;
export declare const config: {
    baseUrl: string;
    headers: {};
};
export declare function get<T>(url: string, options?: Options): Promise<T>;
export declare function post<T>(url: Endpoint<string> | string, options?: Options): Promise<T>;
export declare function put<T>(url: Endpoint<string> | string, options?: Options): Promise<T>;
export declare function remove<T>(url: Endpoint<string> | string, options?: Options): Promise<T>;
