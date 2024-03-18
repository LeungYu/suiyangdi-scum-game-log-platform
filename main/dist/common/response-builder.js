"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBuilder = exports.ResponseStatusCode = void 0;
var ResponseStatusCode;
(function (ResponseStatusCode) {
    ResponseStatusCode[ResponseStatusCode["OK"] = 200] = "OK";
    ResponseStatusCode[ResponseStatusCode["PARAM_REQUIRED"] = 50003] = "PARAM_REQUIRED";
    ResponseStatusCode[ResponseStatusCode["INTERNAL_ERROR"] = 59999] = "INTERNAL_ERROR";
    ResponseStatusCode[ResponseStatusCode["NO_LOGIN"] = 60000] = "NO_LOGIN";
    ResponseStatusCode[ResponseStatusCode["NO_ACCESS"] = 60001] = "NO_ACCESS";
    ResponseStatusCode[ResponseStatusCode["DEFINED_PERMISSION"] = 60002] = "DEFINED_PERMISSION";
    ResponseStatusCode[ResponseStatusCode["VALIDATION_ERROR"] = 60005] = "VALIDATION_ERROR";
})(ResponseStatusCode = exports.ResponseStatusCode || (exports.ResponseStatusCode = {}));
function responseBuilder(status, data = {}, msg = '') {
    return {
        status,
        data,
        msg,
    };
}
exports.responseBuilder = responseBuilder;
//# sourceMappingURL=response-builder.js.map