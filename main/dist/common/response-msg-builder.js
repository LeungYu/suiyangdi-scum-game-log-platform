"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgBuilder = void 0;
const response_builder_1 = require("./response-builder");
function msgBuilder(code, ...args) {
    switch (code) {
        case response_builder_1.ResponseStatusCode.PARAM_REQUIRED:
            return `params: ${args.join(',')} required`;
        case response_builder_1.ResponseStatusCode.NO_ACCESS:
            return 'NO ACCESS';
        default:
            return 'unkown error';
    }
}
exports.msgBuilder = msgBuilder;
//# sourceMappingURL=response-msg-builder.js.map