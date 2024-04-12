"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByHmacMd5 = void 0;
const crypto = require("crypto");
function getTokenByHmacMd5(token, infos, joiner = '-') {
    if (infos.some(item => ('' + item).indexOf(joiner) !== -1)) {
        throw new Error(`info中包含 连接符 '${joiner}'`);
    }
    const hmacMd5 = crypto.createHmac('md5', token);
    return hmacMd5.update(infos.join(joiner)).digest('hex');
}
exports.getTokenByHmacMd5 = getTokenByHmacMd5;
//# sourceMappingURL=hmac.js.map