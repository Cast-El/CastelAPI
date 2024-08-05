import Cache from "./cache";
import { Endpoint } from "./types/endpoint";
import { Options, PostOptions } from "./types/options";
export declare const METHODS: {
    post: string;
    get: string;
    put: string;
    delete: string;
};
declare class Api {
    #private;
    config: {
        baseUrl: string;
        headers: {};
    };
    cache: Cache;
    loading: boolean;
    constructor();
    private _updateOptions;
    private _updateHeaders;
    private _updateBody;
    createUrl(path: string, mapQuery?: Map<string, any>): string;
    get<T>(url: Endpoint<string> | string, options?: PostOptions): Promise<T>;
    post<T>(url: Endpoint<string> | string, options?: PostOptions): Promise<T>;
    put<T>(url: Endpoint<string> | string, options?: Options): Promise<T>;
    delete<T>(url: Endpoint<string> | string, options?: Options): Promise<T>;
}
export default Api;
