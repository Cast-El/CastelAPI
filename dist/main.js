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
exports.config = exports.loading = void 0;
exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;
const commons_1 = require("./commons");
const api_1 = __importDefault(require("./api"));
const api = new api_1.default();
exports.loading = api.loading;
exports.config = api.config;
function get(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if ((_a = options === null || options === void 0 ? void 0 : options.cache) === null || _a === void 0 ? void 0 : _a.useCache) {
            const cachedResponse = api.cache.get(url);
            if (cachedResponse) {
                const currentTime = Date.now();
                const cacheTime = options.cache.cacheTime;
                if (currentTime - cachedResponse.timeStamp < cacheTime) {
                    return cachedResponse.data;
                }
                else {
                    api.cache.delete(url);
                }
            }
        }
        const response = yield api.get(url, options);
        if (options === null || options === void 0 ? void 0 : options.cache)
            api.cache.set(url, response);
        return response;
    });
}
function post(url, options) {
    return api.post(url, options);
}
function put(url, options) {
    return api.put(url, options);
}
function remove(url, options) {
    if ((0, commons_1.isEndpoint)(url)) {
        url = api.config.baseUrl + url;
    }
    return api.delete(url, options);
}
