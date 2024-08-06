import { __classPrivateFieldSet, __classPrivateFieldGet, __awaiter } from 'tslib';

const createUrlWithQuery = (url, mapQuery) => {
    const params = new URLSearchParams();
    for (const [key, value] of mapQuery) {
        if (value !== null) {
            params.append(key, value);
        }
    }
    return `${url}?${params.toString()}`;
};
const isEndpoint = (url) => {
    return url.startsWith("/");
};

var _Cache_store;
class Cache {
    constructor() {
        _Cache_store.set(this, void 0);
        __classPrivateFieldSet(this, _Cache_store, new Map(), "f");
    }
    get(key) {
        const data = __classPrivateFieldGet(this, _Cache_store, "f").get(key);
        return data || null;
    }
    set(key, value, cacheTime) {
        __classPrivateFieldGet(this, _Cache_store, "f").set(key, {
            data: value,
            timeStamp: Date.now() + cacheTime,
        });
    }
    clear() {
        __classPrivateFieldGet(this, _Cache_store, "f").clear();
    }
    delete(key) {
        __classPrivateFieldGet(this, _Cache_store, "f").delete(key);
    }
}
_Cache_store = new WeakMap();

const parseResponse = (response, responseType) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isBlob = ((_a = response.headers) === null || _a === void 0 ? void 0 : _a.get("Content-Type")) === "application/pdf" ||
        responseType === "blob";
    const isError = response instanceof TypeError || !response;
    const hasNoCloneFunction = !response || typeof response.clone !== "function";
    if (isBlob || isError || hasNoCloneFunction) {
        return response;
    }
    const cloneResponse = response.clone();
    let result = yield parseJson(response);
    if (!result.data) {
        result = yield parseeText(cloneResponse);
    }
    if (typeof (result === null || result === void 0 ? void 0 : result.data) === "string") {
        result = parseBoolean(result);
    }
    return result;
});
const parseJson = (response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            data: yield response.json(),
            status: response.status,
            url: response.url,
        };
    }
    catch (_a) {
        return response;
    }
});
const parseeText = (response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            data: yield response.text(),
            status: response.status,
            url: response.url,
        };
    }
    catch (_a) {
        return response;
    }
});
const parseBoolean = (result) => {
    var _a;
    const data = (_a = result.data) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (data === "true")
        result.data = true;
    if (data === "false")
        result.data = false;
    return result;
};

var _Api_instances, _Api_useApi;
const METHODS = {
    post: "POST",
    get: "GET",
    put: "PUT",
    delete: "DELETE",
};
class Api {
    constructor() {
        _Api_instances.add(this);
        this.config = {
            baseUrl: "",
            headers: {},
            timeout: NaN,
        };
        this.loading = false;
        this.activeRequests = 0;
        this.cache = new Cache();
    }
    _updateOptions(method, paramsOptions) {
        var _a;
        let headers;
        if ((paramsOptions === null || paramsOptions === void 0 ? void 0 : paramsOptions.headers) || ((_a = this.config) === null || _a === void 0 ? void 0 : _a.headers)) {
            headers = this._updateHeaders(paramsOptions === null || paramsOptions === void 0 ? void 0 : paramsOptions.headers);
        }
        const options = {
            method,
            headers,
        };
        if (!paramsOptions && !this.config) {
            return options;
        }
        let body;
        if (paramsOptions === null || paramsOptions === void 0 ? void 0 : paramsOptions.body) {
            body = this._updateBody(paramsOptions.body);
            if (body) {
                options.body = body;
            }
        }
        return options;
    }
    _updateHeaders(paramsHeaders) {
        var _a;
        let headers = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.headers) || {};
        if (paramsHeaders) {
            paramsHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        }
        return headers || null;
    }
    _updateBody(body) {
        if (!body) {
            return;
        }
        const doNotFormatPayload = body instanceof FormData || typeof body === "string";
        if (doNotFormatPayload) {
            return body;
        }
        const formatPayload = Object.keys(body).length > 0;
        if (formatPayload) {
            return JSON.stringify(body);
        }
    }
    createUrl(path, mapQuery) {
        if (mapQuery) {
            return createUrlWithQuery(path, mapQuery);
        }
        return path;
    }
    get(url, options) {
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, METHODS.get, url, options);
    }
    post(url, options) {
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, METHODS.post, this.createUrl(url, options === null || options === void 0 ? void 0 : options.parameters), options);
    }
    put(url, options) {
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, METHODS.put, this.createUrl(url, options === null || options === void 0 ? void 0 : options.parameters), options);
    }
    delete(url, options) {
        if (isEndpoint(url)) {
            url = this.config.baseUrl + url;
        }
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, METHODS.delete, this.createUrl(url, options === null || options === void 0 ? void 0 : options.parameters), options);
    }
    useResponseInterceptor(data) {
        var _a;
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.responseInterceptor) {
            return this.config.responseInterceptor(data);
        }
        return data;
    }
}
_Api_instances = new WeakSet(), _Api_useApi = function _Api_useApi(method, url, paramsOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        this.activeRequests++;
        this.loading = true;
        const options = this._updateOptions(method, paramsOptions);
        try {
            const response = yield fetch(url, options);
            const result = parseResponse(response);
            return this.useResponseInterceptor(result);
        }
        catch (error) {
            if (paramsOptions === null || paramsOptions === void 0 ? void 0 : paramsOptions.retry) {
                paramsOptions.retry--;
                return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, method, url, paramsOptions);
            }
            error.response = yield parseResponse(error);
            throw error;
        }
        finally {
            this.activeRequests--;
            if (this.activeRequests === 0) {
                this.loading = false;
            }
        }
    });
};

const apiInstance = new Api();
const config = apiInstance.config;
const loading = () => apiInstance.loading;
function get(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (isEndpoint(url)) {
            url = apiInstance.config.baseUrl + url;
        }
        const cachedResponse = apiInstance.cache.get(url);
        if (cachedResponse) {
            const currentTime = Date.now();
            const isExpired = cachedResponse.timeStamp - currentTime <= 0;
            if (!isExpired) {
                return cachedResponse;
            }
            apiInstance.cache.delete(url);
        }
        const response = yield apiInstance.get(url, options);
        if (((_a = options === null || options === void 0 ? void 0 : options.cache) === null || _a === void 0 ? void 0 : _a.enabled) && ((_b = options === null || options === void 0 ? void 0 : options.cache) === null || _b === void 0 ? void 0 : _b.cacheTime)) {
            apiInstance.cache.set(url, response, options.cache.cacheTime);
        }
        return response;
    });
}
function post(url, options) {
    if (isEndpoint(url)) {
        url = apiInstance.config.baseUrl + url;
    }
    return apiInstance.post(url, options);
}
function put(url, options) {
    if (isEndpoint(url)) {
        url = apiInstance.config.baseUrl + url;
    }
    return apiInstance.put(url, options);
}
function remove(url, options) {
    if (isEndpoint(url)) {
        url = apiInstance.config.baseUrl + url;
    }
    return apiInstance.delete(url, options);
}

export { apiInstance, config, get, loading, post, put, remove };
