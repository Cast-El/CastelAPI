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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.getConfig = exports.setLoading = exports.getLoading = void 0;
exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;
const commons_1 = require("./commons");
const apiInstance_1 = __importDefault(require("./apiInstance"));
console.log('apiInstance in main:', apiInstance_1.default);
const getLoading = () => {
    console.log('getLoading:', apiInstance_1.default.loading);
    return apiInstance_1.default.loading;
};
exports.getLoading = getLoading;
const setLoading = (value) => {
    apiInstance_1.default.loading = value;
    console.log('setLoading:', apiInstance_1.default.loading);
};
exports.setLoading = setLoading;
const getConfig = () => {
    console.log('getConfig:', apiInstance_1.default.config);
    return apiInstance_1.default.config;
};
exports.getConfig = getConfig;
const setConfig = (value) => {
    apiInstance_1.default.config = value;
    console.log('setConfig:', apiInstance_1.default.config);
};
exports.setConfig = setConfig;
function get(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if ((_a = options === null || options === void 0 ? void 0 : options.cache) === null || _a === void 0 ? void 0 : _a.useCache) {
            const cachedResponse = apiInstance_1.default.cache.get(url);
            if (cachedResponse) {
                const currentTime = Date.now();
                const cacheTime = options.cache.cacheTime;
                if (currentTime - cachedResponse.timeStamp < cacheTime) {
                    return cachedResponse;
                }
                else {
                    apiInstance_1.default.cache.delete(url);
                }
            }
        }
        const response = yield apiInstance_1.default.get(url, options);
        if (options === null || options === void 0 ? void 0 : options.cache)
            apiInstance_1.default.cache.set(url, response);
        return response;
    });
}
function post(url, options) {
    return apiInstance_1.default.post(url, options);
}
function put(url, options) {
    return apiInstance_1.default.put(url, options);
}
function remove(url, options) {
    if ((0, commons_1.isEndpoint)(url)) {
        url = apiInstance_1.default.config.baseUrl + url;
    }
    return apiInstance_1.default.delete(url, options);
}
