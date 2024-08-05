"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEndpoint = exports.createUrlWithQuery = void 0;
const createUrlWithQuery = (url, mapQuery) => {
    const params = new URLSearchParams();
    for (const [key, value] of mapQuery) {
        if (value !== null) {
            params.append(key, value);
        }
    }
    return `${url}?${params.toString()}`;
};
exports.createUrlWithQuery = createUrlWithQuery;
const isEndpoint = (url) => {
    return url.startsWith("/");
};
exports.isEndpoint = isEndpoint;
