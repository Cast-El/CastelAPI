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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = exports.parse = void 0;
const parse = (response, responseType) => {
    if (!response.ok) {
        throw response;
    }
    return Promise.resolve((0, exports.parseResponse)(response, responseType));
};
exports.parse = parse;
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
exports.parseResponse = parseResponse;
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
