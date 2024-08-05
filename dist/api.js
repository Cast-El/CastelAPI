"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Api_instances, _Api_useApi;
Object.defineProperty(exports, "__esModule", { value: true });
exports.METHODS = void 0;
const cache_1 = __importDefault(require("./cache"));
const commons_1 = require("./commons");
const parser_1 = require("./parser");
exports.METHODS = {
    post: "POST",
    get: "GET",
    put: "PUT",
    delete: "DELETE",
};
class Api {
    constructor() {
        _Api_instances.add(this);
        this.config = { baseUrl: "", headers: {} };
        this.loading = false;
        this.cache = new cache_1.default();
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
            return (0, commons_1.createUrlWithQuery)(path, mapQuery);
        }
        return path;
    }
    get(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = options === null || options === void 0 ? void 0 : options.cache;
            if (cache) {
                const cachedResponse = this.cache.get(url);
                if (cachedResponse)
                    return cachedResponse;
            }
            const response = yield __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, exports.METHODS.get, url, options);
            if (cache) {
                this.cache.set(url, response);
            }
            return response;
        });
    }
    post(url, options) {
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, exports.METHODS.post, this.createUrl(url, options === null || options === void 0 ? void 0 : options.parameters), options);
    }
    put(url, options) {
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, exports.METHODS.put, this.createUrl(url, options === null || options === void 0 ? void 0 : options.parameters), options);
    }
    delete(url, options) {
        if ((0, commons_1.isEndpoint)(url)) {
            url = this.config.baseUrl + url;
        }
        return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, exports.METHODS.delete, this.createUrl(url, options === null || options === void 0 ? void 0 : options.parameters), options);
    }
}
_Api_instances = new WeakSet(), _Api_useApi = function _Api_useApi(method, url, paramsOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        this.loading = true;
        console.log(this.loading);
        const options = this._updateOptions(method, paramsOptions);
        try {
            const response = yield fetch(url, options);
            return (0, parser_1.parseResponse)(response);
        }
        catch (error) {
            if (paramsOptions === null || paramsOptions === void 0 ? void 0 : paramsOptions.retry) {
                paramsOptions.retry--;
                return __classPrivateFieldGet(this, _Api_instances, "m", _Api_useApi).call(this, method, url, paramsOptions);
            }
            error.response = yield (0, parser_1.parseResponse)(error);
            throw error;
        }
        finally {
            this.loading = false;
            console.log(this.loading);
        }
    });
};
exports.default = Api;
